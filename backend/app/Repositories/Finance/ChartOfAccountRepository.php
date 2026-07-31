<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\ChartOfAccount;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ChartOfAccountRepository extends BaseRepository implements ChartOfAccountRepositoryInterface
{
    protected function model(): ChartOfAccount
    {
        return new ChartOfAccount;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['parentCategory', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('account_code', 'like', "%{$s}%")
                       ->orWhere('account_name', 'like', "%{$s}%")
                       ->orWhere('description', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('is_active', $v === 'active'))
            ->when($filters['account_type'] ?? null, fn (Builder $q, string $v) => $q->where('account_type', $v))
            ->when($filters['account_subtype'] ?? null, fn (Builder $q, string $v) => $q->where('account_subtype', $v))
            ->when($filters['parent_id'] ?? null, fn (Builder $q, $v) => $q->where('parent_id', $v));

        $sortBy = $filters['sort_by'] ?? 'account_code';
        $sortDir = $filters['sort_dir'] ?? 'asc';
        $allowed = ['account_code', 'account_name', 'account_type', 'current_balance', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('account_code', 'asc');
        }

        return $query->paginate($perPage);
    }

    public function getAllActive(): Collection
    {
        return $this->model->where('is_active', true)
            ->orderBy('account_code', 'asc')
            ->get();
    }

    public function getById(int $id): ?ChartOfAccount
    {
        return $this->model->with(['parentCategory', 'childCategories', 'createdBy', 'updatedBy'])->find($id);
    }

    public function getByUuid(string $uuid): ?ChartOfAccount
    {
        return $this->model->where('uuid', $uuid)->with([
            'parentCategory', 'childCategories', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): ChartOfAccount
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ChartOfAccount
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

    public function getByAccountType(string $type): Collection
    {
        return $this->model->where('account_type', $type)
            ->where('is_active', true)
            ->orderBy('account_code', 'asc')
            ->get();
    }

    public function getAccountTree(): Collection
    {
        return $this->model->where('is_active', true)
            ->orderBy('account_code', 'asc')
            ->get();
    }

    public function updateBalance(int $id, float $debitAmount, float $creditAmount): void
    {
        $account = $this->model->findOrFail($id);
        $newBalance = (float) $account->current_balance + $debitAmount - $creditAmount;
        $account->update(['current_balance' => $newBalance]);
    }
}
