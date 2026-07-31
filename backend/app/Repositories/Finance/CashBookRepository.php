<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\CashBook;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class CashBookRepository extends BaseRepository implements CashBookRepositoryInterface
{
    protected function model(): CashBook
    {
        return new CashBook;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['journalEntry', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('description', 'like', "%{$s}%")
                       ->orWhere('reference_type', 'like', "%{$s}%");
                })
            )
            ->when($filters['transaction_type'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_type', $v))
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

    public function addEntry(array $data): CashBook
    {
        return $this->model->create($data);
    }

    public function getBalance(): float
    {
        $lastEntry = $this->model
            ->orderByDesc('id')
            ->first();

        return $lastEntry ? (float) $lastEntry->balance : 0.0;
    }
}
