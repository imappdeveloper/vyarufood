<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\BankAccount;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class BankAccountRepository extends BaseRepository implements BankAccountRepositoryInterface
{
    protected function model(): BankAccount
    {
        return new BankAccount;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['chartOfAccount', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('bank_name', 'like', "%{$s}%")
                       ->orWhere('account_number', 'like', "%{$s}%")
                       ->orWhere('account_holder_name', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('is_active', $v === 'active'))
            ->when($filters['account_type'] ?? null, fn (Builder $q, string $v) => $q->where('account_type', $v));

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['bank_name', 'account_number', 'current_balance', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate($perPage);
    }

    public function getById(int $id): ?BankAccount
    {
        return $this->model->with([
            'chartOfAccount', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?BankAccount
    {
        return $this->model->where('uuid', $uuid)->with([
            'chartOfAccount', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): BankAccount
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): BankAccount
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

    public function getDefault(): ?BankAccount
    {
        return $this->model->with(['chartOfAccount'])
            ->where('is_default', true)
            ->where('is_active', true)
            ->first();
    }

    public function getAllActive(): Collection
    {
        return $this->model->where('is_active', true)
            ->with(['chartOfAccount'])
            ->orderBy('bank_name', 'asc')
            ->get();
    }
}
