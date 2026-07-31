<?php

declare(strict_types=1);

namespace App\Services\Expense;

use App\DTOs\Expense\ExpenseDTO;
use App\Models\Expense;
use App\Models\ExpenseApproval;
use App\Repositories\Expense\ExpenseRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ExpenseService extends BaseService implements ExpenseServiceInterface
{
    protected string $moduleName = 'expense';

    public function __construct(
        private readonly ExpenseRepositoryInterface $repo,
    ) {}

    public function getPaginatedExpenses(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getExpenseById(int $id): ?Expense
    {
        return $this->repo->getById($id);
    }

    public function getExpenseByUuid(string $uuid): ?Expense
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createExpense(ExpenseDTO $dto): Expense
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = array_merge($dto->toArray(), [
                'expense_number' => $this->repo->generateExpenseNumber(),
                'total_amount' => max(0, $dto->amount + $dto->taxAmount - $dto->discountAmount),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $expense = $this->repo->create($data);

            CacheManager::flush('expense');
            $this->logInfo('Expense created', ['expense_id' => $expense->id, 'number' => $expense->expense_number]);

            return $expense->fresh(['category', 'supplier']);
        });
    }

    public function updateExpense(int $id, ExpenseDTO $dto): ?Expense
    {
        return $this->transaction(function () use ($id, $dto) {
            $expense = $this->repo->getById($id);

            if (! $expense) {
                throw new \RuntimeException('Expense not found.');
            }

            if (in_array($expense->approval_status, ['approved', 'paid'])) {
                throw new \RuntimeException('Cannot edit an approved or paid expense.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter($dto->toArray(), fn ($v) => $v !== null);
            $data['total_amount'] = max(0, $dto->amount + $dto->taxAmount - $dto->discountAmount);
            $data['updated_by'] = $adminId;

            $this->repo->update($id, $data);

            CacheManager::flush('expense');
            $this->logInfo('Expense updated', ['expense_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function deleteExpense(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $expense = $this->repo->getById($id);

            if (! $expense) {
                throw new \RuntimeException('Expense not found.');
            }

            $expense->delete();

            CacheManager::flush('expense');
            $this->logInfo('Expense deleted', ['expense_id' => $id]);

            return true;
        });
    }

    public function approveExpense(int $id, ?int $approvedBy): ?Expense
    {
        return $this->transaction(function () use ($id, $approvedBy) {
            $expense = $this->repo->getById($id);

            if (! $expense) {
                throw new \RuntimeException('Expense not found.');
            }

            if ($expense->approval_status !== 'pending_approval') {
                throw new \RuntimeException('Only expenses pending approval can be approved.');
            }

            $this->repo->update($id, [
                'approval_status' => 'approved',
                'expense_status' => 'approved',
                'approved_by' => $approvedBy,
                'approved_at' => now(),
            ]);

            ExpenseApproval::create([
                'expense_id' => $id,
                'approval_level' => 1,
                'approved_by' => $approvedBy,
                'approval_status' => 'approved',
                'approval_date' => now(),
            ]);

            CacheManager::flush('expense');
            $this->logInfo('Expense approved', ['expense_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function rejectExpense(int $id, ?int $approvedBy, ?string $remarks): ?Expense
    {
        return $this->transaction(function () use ($id, $approvedBy, $remarks) {
            $expense = $this->repo->getById($id);

            if (! $expense) {
                throw new \RuntimeException('Expense not found.');
            }

            if ($expense->approval_status !== 'pending_approval') {
                throw new \RuntimeException('Only expenses pending approval can be rejected.');
            }

            $this->repo->update($id, [
                'approval_status' => 'rejected',
                'expense_status' => 'rejected',
                'approved_by' => $approvedBy,
                'approved_at' => now(),
                'remarks' => $remarks ?? $expense->remarks,
            ]);

            ExpenseApproval::create([
                'expense_id' => $id,
                'approval_level' => 1,
                'approved_by' => $approvedBy,
                'approval_status' => 'rejected',
                'approval_date' => now(),
                'remarks' => $remarks,
            ]);

            CacheManager::flush('expense');
            $this->logInfo('Expense rejected', ['expense_id' => $id, 'remarks' => $remarks]);

            return $this->repo->getById($id);
        });
    }

    public function markAsPaid(int $id): ?Expense
    {
        return $this->transaction(function () use ($id) {
            $expense = $this->repo->getById($id);

            if (! $expense) {
                throw new \RuntimeException('Expense not found.');
            }

            if ($expense->approval_status !== 'approved') {
                throw new \RuntimeException('Only approved expenses can be marked as paid.');
            }

            $this->repo->update($id, [
                'expense_status' => 'paid',
            ]);

            CacheManager::flush('expense');
            $this->logInfo('Expense marked as paid', ['expense_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function getStats(): array
    {
        return $this->repo->countByStatus();
    }

    public function getDashboardStats(): array
    {
        $stats = $this->repo->countByStatus();

        $now = now();
        $stats['this_month_total'] = (float) Expense::whereYear('expense_date', $now->year)
            ->whereMonth('expense_date', $now->month)
            ->where('approval_status', '!=', 'rejected')
            ->where('expense_status', '!=', 'cancelled')
            ->sum('total_amount');

        $stats['this_month_tax'] = (float) Expense::whereYear('expense_date', $now->year)
            ->whereMonth('expense_date', $now->month)
            ->where('approval_status', '!=', 'rejected')
            ->where('expense_status', '!=', 'cancelled')
            ->sum('tax_amount');

        $stats['pending_count'] = Expense::where('approval_status', 'pending_approval')->count();
        $stats['recurring_due'] = $this->repo->getRecurringExpensesDue()->count();

        $stats['recent_expenses'] = Expense::with(['category'])
            ->latest()
            ->limit(5)
            ->get();

        return $stats;
    }

    public function getPendingApprovals(): Collection
    {
        return $this->repo->getPendingApprovals();
    }

    public function getMonthlySummary(int $year, int $month): array
    {
        return $this->repo->getMonthlySummary($year, $month);
    }

    public function getCategoryWiseSummary(string $dateFrom, string $dateTo): Collection
    {
        return $this->repo->getCategoryWiseSummary($dateFrom, $dateTo);
    }

    public function getRecurringExpensesDue(): Collection
    {
        return $this->repo->getRecurringExpensesDue();
    }
}
