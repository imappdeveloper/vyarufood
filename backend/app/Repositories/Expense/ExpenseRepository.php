<?php

declare(strict_types=1);

namespace App\Repositories\Expense;

use App\Models\Expense;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ExpenseRepository extends BaseRepository implements ExpenseRepositoryInterface
{
    protected function model(): Expense
    {
        return new Expense;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['category', 'supplier', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('expense_number', 'like', "%{$s}%")
                       ->orWhere('expense_title', 'like', "%{$s}%")
                       ->orWhere('vendor_name', 'like', "%{$s}%")
                       ->orWhere('invoice_number', 'like', "%{$s}%");
                })
            )
            ->when($filters['expense_category_id'] ?? null, fn (Builder $q, $v) => $q->where('expense_category_id', $v))
            ->when($filters['approval_status'] ?? null, fn (Builder $q, string $v) => $q->where('approval_status', $v))
            ->when($filters['expense_status'] ?? null, fn (Builder $q, string $v) => $q->where('expense_status', $v))
            ->when($filters['payment_method'] ?? null, fn (Builder $q, string $v) => $q->where('payment_method', $v))
            ->when($filters['supplier_id'] ?? null, fn (Builder $q, $v) => $q->where('supplier_id', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->where('expense_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->where('expense_date', '<=', $v))
            ->when(($filters['is_recurring'] ?? null) !== null, fn (Builder $q, $v) => $q->where('is_recurring', $v));

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['expense_number', 'expense_date', 'expense_title', 'total_amount', 'approval_status', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate($perPage);
    }

    public function getById(int $id): ?Expense
    {
        return $this->model->with([
            'category', 'supplier', 'approvedBy', 'createdBy', 'updatedBy',
            'attachments', 'approvals.approvedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?Expense
    {
        return $this->model->where('uuid', $uuid)->with([
            'category', 'supplier', 'approvedBy', 'createdBy', 'updatedBy',
            'attachments', 'approvals.approvedBy',
        ])->first();
    }

    public function create(array $data): Expense
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Expense
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

    public function generateExpenseNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "EXP-{$date}-";

        $last = $this->model->where('expense_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('expense_number')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->expense_number, -4);
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
            'draft' => $this->model->where('approval_status', 'draft')->count(),
            'pending_approval' => $this->model->where('approval_status', 'pending_approval')->count(),
            'approved' => $this->model->where('approval_status', 'approved')->count(),
            'paid' => $this->model->where('expense_status', 'paid')->count(),
            'rejected' => $this->model->where('approval_status', 'rejected')->count(),
            'cancelled' => $this->model->where('expense_status', 'cancelled')->count(),
        ];
    }

    public function getPendingApprovals(): Collection
    {
        return $this->model->with(['category', 'supplier', 'createdBy'])
            ->where('approval_status', 'pending_approval')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getMonthlySummary(int $year, int $month): array
    {
        $expenses = $this->model
            ->selectRaw('expense_category_id, SUM(total_amount) as total, COUNT(*) as count')
            ->whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->where('approval_status', '!=', 'rejected')
            ->where('expense_status', '!=', 'cancelled')
            ->groupBy('expense_category_id')
            ->get();

        $totalAmount = $this->model
            ->whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->where('approval_status', '!=', 'rejected')
            ->where('expense_status', '!=', 'cancelled')
            ->sum('total_amount');

        $totalTax = $this->model
            ->whereYear('expense_date', $year)
            ->whereMonth('expense_date', $month)
            ->where('approval_status', '!=', 'rejected')
            ->where('expense_status', '!=', 'cancelled')
            ->sum('tax_amount');

        return [
            'year' => $year,
            'month' => $month,
            'total_amount' => (float) $totalAmount,
            'total_tax' => (float) $totalTax,
            'total_expenses' => $this->model
                ->whereYear('expense_date', $year)
                ->whereMonth('expense_date', $month)
                ->where('approval_status', '!=', 'rejected')
                ->where('expense_status', '!=', 'cancelled')
                ->count(),
            'by_category' => $expenses,
        ];
    }

    public function getCategoryWiseSummary(string $dateFrom, string $dateTo): Collection
    {
        return $this->model
            ->selectRaw('expense_category_id, SUM(total_amount) as total_amount, COUNT(*) as expense_count')
            ->where('expense_date', '>=', $dateFrom)
            ->where('expense_date', '<=', $dateTo)
            ->where('approval_status', '!=', 'rejected')
            ->where('expense_status', '!=', 'cancelled')
            ->groupBy('expense_category_id')
            ->orderByDesc('total_amount')
            ->get();
    }

    public function getRecurringExpensesDue(): Collection
    {
        return $this->model->with(['category', 'supplier'])
            ->where('is_recurring', true)
            ->where('next_due_date', '<=', now()->toDateString())
            ->where('approval_status', '!=', 'cancelled')
            ->get();
    }
}
