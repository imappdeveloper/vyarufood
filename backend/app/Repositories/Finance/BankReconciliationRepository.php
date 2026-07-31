<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\BankReconciliation;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class BankReconciliationRepository extends BaseRepository implements BankReconciliationRepositoryInterface
{
    protected function model(): BankReconciliation
    {
        return new BankReconciliation;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['bankAccount', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('reconciliation_number', 'like', "%{$s}%")
                       ->orWhere('notes', 'like', "%{$s}%");
                })
            )
            ->when($filters['bank_account_id'] ?? null, fn (Builder $q, $v) => $q->where('bank_account_id', $v))
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->where('reconciliation_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->where('reconciliation_date', '<=', $v));

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['reconciliation_number', 'reconciliation_date', 'status', 'difference', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate($perPage);
    }

    public function getById(int $id): ?BankReconciliation
    {
        return $this->model->with([
            'bankAccount', 'reconciledBy', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?BankReconciliation
    {
        return $this->model->where('uuid', $uuid)->with([
            'bankAccount', 'reconciledBy', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): BankReconciliation
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): BankReconciliation
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = $this->model->find($id);
        return $record ? $record->delete() : false;
    }

    public function getPendingForBankAccount(int $bankAccountId): Collection
    {
        return $this->model->with(['bankAccount', 'createdBy'])
            ->where('bank_account_id', $bankAccountId)
            ->where('status', 'pending')
            ->orderByDesc('reconciliation_date')
            ->get();
    }

    public function completeReconciliation(int $id, int $reconciledBy): BankReconciliation
    {
        $record = $this->model->findOrFail($id);
        $record->update([
            'status' => 'completed',
            'reconciled_at' => now(),
            'reconciled_by' => $reconciledBy,
        ]);

        return $record->fresh(['bankAccount', 'reconciledBy']);
    }
}
