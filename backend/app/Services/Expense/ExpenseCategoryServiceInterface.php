<?php

declare(strict_types=1);

namespace App\Services\Expense;

use App\DTOs\Expense\ExpenseCategoryDTO;
use App\Models\ExpenseCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ExpenseCategoryServiceInterface
{
    public function getPaginatedCategories(array $filters, int $perPage): LengthAwarePaginator;
    public function getCategoryById(int $id): ?ExpenseCategory;
    public function getCategoryByUuid(string $uuid): ?ExpenseCategory;
    public function createCategory(ExpenseCategoryDTO $dto): ExpenseCategory;
    public function updateCategory(int $id, ExpenseCategoryDTO $dto): ?ExpenseCategory;
    public function deleteCategory(int $id): bool;
    public function getStats(): array;
    public function getAllActive(): Collection;
}
