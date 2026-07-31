<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\BankBook;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class BankBookRepository extends BaseRepository implements BankBookRepositoryInterface
{
    protected function model(): BankBook
    {
        return new BankBook;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['bankAccount', 'journalEntry', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('description', 'like', "%{$s}%")
                       ->orWhere('reference_type', 'like', "%{$s}%");
                })
            )
            ->when($filters['bank_account_id'] ?? null, fn (Builder $q, $v) => $q->where('bank_account_id', $v))
            ->when($filters['transaction_type'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_type', $v))
            ->when($filters['is_reconciled'] ?? null, fn (Builder $q, $v) => $q->where('is_reconciled', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_date', '<=', $v));

        $sortBy = $filters['sort_by'] ?? 'transaction_date';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['transaction_date', 'debit_amount', 'credit_amount', 'balance', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('transaction_date');
        }

        return $query->paginate($perPage);
    }

    public function getByBankAccount(int $bankAccountId, array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['bankAccount', 'journalEntry', 'createdBy'])
            ->where('bank_account_id', $bankAccountId)
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('description', 'like', "%{$s}%")
                       ->orWhere('reference_type', 'like', "%{$s}%");
                })
            )
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_date', '<=', $v));

        $query->orderByDesc('transaction_date');

        return $query->paginate($perPage);
    }

    public function addEntry(array $data): BankBook
    {
        return $this->model->create($data);
    }

    public function getBalance(int $bankAccountId): float
    {
        $lastEntry = $this->model
            ->where('bank_account_id', $bankAccountId)
            ->orderByDesc('id')
            ->first();

        return $lastEntry ? (float) $lastEntry->balance : 0.0;
    }
}
