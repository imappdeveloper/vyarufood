<?php

declare(strict_types=1);

namespace App\Repositories\Expense;

use App\Models\ExpenseCategory;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ExpenseCategoryRepository extends BaseRepository implements ExpenseCategoryRepositoryInterface
{
    protected function model(): ExpenseCategory
    {
        return new ExpenseCategory;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['parentCategory', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('category_code', 'like', "%{$s}%")
                       ->orWhere('category_name', 'like', "%{$s}%");
                })
            )
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when(array_key_exists('is_recurring', $filters) && $filters['is_recurring'] !== null, fn (Builder $q, $v) => $q->where('is_recurring', $v));

        return $query->orderBy('display_order')->orderBy('category_name')->paginate($perPage);
    }

    public function getById(int $id): ?ExpenseCategory
    {
        return $this->model->with(['parentCategory', 'childCategories', 'createdBy', 'updatedBy'])->find($id);
    }

    public function getByUuid(string $uuid): ?ExpenseCategory
    {
        return $this->model->where('uuid', $uuid)->with(['parentCategory', 'childCategories', 'createdBy', 'updatedBy'])->first();
    }

    public function create(array $data): ExpenseCategory
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?ExpenseCategory
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

    public function generateCategoryCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = "EC-{$date}-";

        $last = $this->model->where('category_code', 'LIKE', "{$prefix}%")
            ->orderByDesc('category_code')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->category_code, -4);
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
        ];
    }

    public function getAllActive(): Collection
    {
        return $this->model->where('status', 'active')->orderBy('display_order')->orderBy('category_name')->get();
    }
}
