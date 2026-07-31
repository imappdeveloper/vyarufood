<?php

declare(strict_types=1);

namespace App\Repositories\Expense;

use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ExpenseRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?Expense;
    public function getByUuid(string $uuid): ?Expense;
    public function create(array $data): Expense;
    public function update(int $id, array $data): ?Expense;
    public function delete(int $id): bool;
    public function generateExpenseNumber(): string;
    public function countByStatus(): array;
    public function getPendingApprovals(): Collection;
    public function getMonthlySummary(int $year, int $month): array;
    public function getCategoryWiseSummary(string $dateFrom, string $dateTo): Collection;
    public function getRecurringExpensesDue(): Collection;
}
