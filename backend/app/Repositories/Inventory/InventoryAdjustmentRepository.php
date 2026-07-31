<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryAdjustment;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class InventoryAdjustmentRepository extends BaseRepository implements InventoryAdjustmentRepositoryInterface
{
    protected function model(): InventoryAdjustment
    {
        return new InventoryAdjustment;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['inventoryItem', 'approvedBy', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('adjustment_number', 'like', "%{$s}%")
                       ->orWhere('reason', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when($filters['adjustment_type'] ?? null, fn (Builder $q, string $v) => $q->where('adjustment_type', $v))
            ->when($filters['inventory_item_id'] ?? null, fn (Builder $q, int $v) => $q->where('inventory_item_id', $v));

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getById(int $id): ?InventoryAdjustment
    {
        return $this->model->with([
            'inventoryItem', 'approvedBy', 'createdBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?InventoryAdjustment
    {
        return $this->model->where('uuid', $uuid)->with([
            'inventoryItem', 'approvedBy', 'createdBy',
        ])->first();
    }

    public function create(array $data): InventoryAdjustment
    {
        return $this->model->create($data);
    }

    public function approve(int $id, int $adminId): ?InventoryAdjustment
    {
        $record = $this->model->find($id);
        if ($record && $record->status === 'pending') {
            $record->update([
                'status' => 'approved',
                'approved_by' => $adminId,
                'approved_at' => now(),
            ]);
        }
        return $record;
    }

    public function generateAdjustmentNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "ADJ-{$date}-";

        $lastAdjustment = $this->model->where('adjustment_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('adjustment_number')
            ->first();

        if ($lastAdjustment) {
            $lastNumber = (int) substr($lastAdjustment->adjustment_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }
}
