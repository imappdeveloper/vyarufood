<?php

declare(strict_types=1);

namespace App\Repositories\Expense;

use App\Models\ExpenseCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ExpenseCategoryRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?ExpenseCategory;
    public function getByUuid(string $uuid): ?ExpenseCategory;
    public function create(array $data): ExpenseCategory;
    public function update(int $id, array $data): ?ExpenseCategory;
    public function delete(int $id): bool;
    public function generateCategoryCode(): string;
    public function countByStatus(): array;
    public function getAllActive(): Collection;
}
