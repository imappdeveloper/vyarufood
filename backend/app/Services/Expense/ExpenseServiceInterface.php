<?php

declare(strict_types=1);

namespace App\Services\Expense;

use App\DTOs\Expense\ExpenseDTO;
use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ExpenseServiceInterface
{
    public function getPaginatedExpenses(array $filters, int $perPage): LengthAwarePaginator;
    public function getExpenseById(int $id): ?Expense;
    public function getExpenseByUuid(string $uuid): ?Expense;
    public function createExpense(ExpenseDTO $dto): Expense;
    public function updateExpense(int $id, ExpenseDTO $dto): ?Expense;
    public function deleteExpense(int $id): bool;
    public function approveExpense(int $id, ?int $approvedBy): ?Expense;
    public function rejectExpense(int $id, ?int $approvedBy, ?string $remarks): ?Expense;
    public function markAsPaid(int $id): ?Expense;
    public function getStats(): array;
    public function getDashboardStats(): array;
    public function getPendingApprovals(): Collection;
    public function getMonthlySummary(int $year, int $month): array;
    public function getCategoryWiseSummary(string $dateFrom, string $dateTo): Collection;
    public function getRecurringExpensesDue(): Collection;
}
