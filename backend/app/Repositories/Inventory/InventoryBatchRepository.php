<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryBatch;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class InventoryBatchRepository extends BaseRepository implements InventoryBatchRepositoryInterface
{
    protected function model(): InventoryBatch
    {
        return new InventoryBatch;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['inventoryItem', 'supplier', 'purchaseOrder'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('batch_number', 'like', "%{$s}%")
                       ->orWhere('lot_number', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when($filters['inventory_item_id'] ?? null, fn (Builder $q, int $v) => $q->where('inventory_item_id', $v))
            ->when($filters['supplier_id'] ?? null, fn (Builder $q, int $v) => $q->where('supplier_id', $v))
            ->when($filters['expired'] ?? null, fn (Builder $q) =>
                $q->where('expiry_date', '<', now()->toDateString())
                  ->where('status', 'active')
            );

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getById(int $id): ?InventoryBatch
    {
        return $this->model->with([
            'inventoryItem', 'supplier', 'purchaseOrder', 'goodsReceipt',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?InventoryBatch
    {
        return $this->model->where('uuid', $uuid)->with([
            'inventoryItem', 'supplier', 'purchaseOrder', 'goodsReceipt',
        ])->first();
    }

    public function create(array $data): InventoryBatch
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?InventoryBatch
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

    public function getActiveBatches(int $itemId): Collection
    {
        return $this->model->with(['supplier'])
            ->where('inventory_item_id', $itemId)
            ->where('status', 'active')
            ->where('available_quantity', '>', 0)
            ->orderBy('expiry_date')
            ->get();
    }

    public function getExpiredBatches(): Collection
    {
        return $this->model->with(['inventoryItem', 'supplier'])
            ->where('status', 'active')
            ->where('expiry_date', '<', now()->toDateString())
            ->orderBy('expiry_date')
            ->get();
    }

    public function generateBatchNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "BATCH-{$date}-";

        $lastBatch = $this->model->where('batch_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('batch_number')
            ->first();

        if ($lastBatch) {
            $lastNumber = (int) substr($lastBatch->batch_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }
}
