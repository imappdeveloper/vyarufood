<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryItem;
use App\Models\InventoryBatch;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class InventoryItemRepository extends BaseRepository implements InventoryItemRepositoryInterface
{
    protected function model(): InventoryItem
    {
        return new InventoryItem;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['unit', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('item_code', 'like', "%{$s}%")
                       ->orWhere('item_name', 'like', "%{$s}%")
                       ->orWhere('sku', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when($filters['category_name'] ?? null, fn (Builder $q, string $v) => $q->where('category_name', $v))
            ->when($filters['low_stock'] ?? null, fn (Builder $q) =>
                $q->whereColumn('current_stock', '<=', 'reorder_level')
                  ->where('reorder_level', '>', 0)
            );

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getById(int $id): ?InventoryItem
    {
        return $this->model->with([
            'unit', 'category', 'batches', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?InventoryItem
    {
        return $this->model->where('uuid', $uuid)->with([
            'unit', 'category', 'batches', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): InventoryItem
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?InventoryItem
    {
        $record = $this->model->find($id);
        if ($record) {
            $record->update($data);
        }
        return $record;
    }

    public function delete(int $id): bool
    {
        $record = $this->model->find($id);
        return $record ? $record->delete() : false;
    }

    public function generateItemCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = "INV-{$date}-";

        $lastItem = $this->model->where('item_code', 'LIKE', "{$prefix}%")
            ->orderByDesc('item_code')
            ->first();

        if ($lastItem) {
            $lastNumber = (int) substr($lastItem->item_code, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }

    public function countByStatus(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('status', 'active')->count(),
            'inactive' => $this->model->where('status', 'inactive')->count(),
            'discontinued' => $this->model->where('status', 'discontinued')->count(),
            'out_of_stock' => $this->model->where('status', 'out_of_stock')->count(),
        ];
    }

    public function getLowStockItems(): Collection
    {
        return $this->model->with(['unit'])
            ->whereColumn('current_stock', '<=', 'reorder_level')
            ->where('reorder_level', '>', 0)
            ->where('status', 'active')
            ->orderBy('item_name')
            ->get();
    }

    public function getExpiringItems(int $days = 30): Collection
    {
        $expiryDate = now()->addDays($days)->toDateString();

        return $this->model->with(['unit'])
            ->where('expiry_tracking', true)
            ->whereHas('batches', fn (Builder $q) =>
                $q->where('status', 'active')
                  ->where('expiry_date', '<=', $expiryDate)
                  ->where('expiry_date', '>=', now()->toDateString())
            )
            ->orderBy('item_name')
            ->get();
    }

    public function getTotalStockValue(): float
    {
        $result = $this->model
            ->selectRaw('COALESCE(SUM(current_stock * average_cost), 0) as total_value')
            ->first();

        return (float) ($result->total_value ?? 0);
    }
}
