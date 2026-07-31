<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryTransaction;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class InventoryTransactionRepository extends BaseRepository implements InventoryTransactionRepositoryInterface
{
    protected function model(): InventoryTransaction
    {
        return new InventoryTransaction;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['inventoryItem', 'batch', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('transaction_number', 'like', "%{$s}%")
                       ->orWhere('reference_number', 'like', "%{$s}%");
                })
            )
            ->when($filters['transaction_type'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_type', $v))
            ->when($filters['inventory_item_id'] ?? null, fn (Builder $q, int $v) => $q->where('inventory_item_id', $v))
            ->when($filters['batch_id'] ?? null, fn (Builder $q, int $v) => $q->where('batch_id', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->whereDate('created_at', '<=', $v));

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getById(int $id): ?InventoryTransaction
    {
        return $this->model->with([
            'inventoryItem', 'batch', 'createdBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?InventoryTransaction
    {
        return $this->model->where('uuid', $uuid)->with([
            'inventoryItem', 'batch', 'createdBy',
        ])->first();
    }

    public function create(array $data): InventoryTransaction
    {
        return $this->model->create($data);
    }

    public function getLedger(int $itemId, array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['batch', 'createdBy'])
            ->where('inventory_item_id', $itemId)
            ->when($filters['transaction_type'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_type', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->whereDate('created_at', '<=', $v));

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function generateTransactionNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "TXN-{$date}-";

        $lastTransaction = $this->model->where('transaction_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('transaction_number')
            ->first();

        if ($lastTransaction) {
            $lastNumber = (int) substr($lastTransaction->transaction_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }
}
