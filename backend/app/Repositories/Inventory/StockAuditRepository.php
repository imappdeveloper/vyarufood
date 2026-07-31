<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\StockAudit;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class StockAuditRepository extends BaseRepository implements StockAuditRepositoryInterface
{
    protected function model(): StockAudit
    {
        return new StockAudit;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['inventoryItem', 'approvedBy', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('audit_number', 'like', "%{$s}%")
                       ->orWhere('notes', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when($filters['inventory_item_id'] ?? null, fn (Builder $q, int $v) => $q->where('inventory_item_id', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->whereDate('audit_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->whereDate('audit_date', '<=', $v));

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getById(int $id): ?StockAudit
    {
        return $this->model->with([
            'inventoryItem', 'approvedBy', 'createdBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?StockAudit
    {
        return $this->model->where('uuid', $uuid)->with([
            'inventoryItem', 'approvedBy', 'createdBy',
        ])->first();
    }

    public function create(array $data): StockAudit
    {
        return $this->model->create($data);
    }

    public function approve(int $id, int $adminId): ?StockAudit
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

    public function reject(int $id, int $adminId): ?StockAudit
    {
        $record = $this->model->find($id);
        if ($record && $record->status === 'pending') {
            $record->update([
                'status' => 'rejected',
                'approved_by' => $adminId,
                'approved_at' => now(),
            ]);
        }
        return $record;
    }

    public function generateAuditNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "AUD-{$date}-";

        $lastAudit = $this->model->where('audit_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('audit_number')
            ->first();

        if ($lastAudit) {
            $lastNumber = (int) substr($lastAudit->audit_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }
}
