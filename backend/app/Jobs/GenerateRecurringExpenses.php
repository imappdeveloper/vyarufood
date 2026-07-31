<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Expense;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateRecurringExpenses implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct() {}

    public function handle(): void
    {
        $recurringExpenses = Expense::with(['category', 'supplier'])
            ->where('is_recurring', true)
            ->where('next_due_date', '<=', now()->toDateString())
            ->where('approval_status', '!=', 'cancelled')
            ->get();

        foreach ($recurringExpenses as $template) {
            $nextDue = $this->calculateNextDueDate($template->next_due_date, $template->recurring_frequency);

            $newExpense = Expense::create([
                'expense_number' => $this->generateExpenseNumber(),
                'expense_category_id' => $template->expense_category_id,
                'expense_date' => now()->toDateString(),
                'expense_title' => $template->expense_title . ' (Recurring)',
                'expense_description' => $template->expense_description,
                'vendor_name' => $template->vendor_name,
                'supplier_id' => $template->supplier_id,
                'amount' => $template->amount,
                'tax_amount' => $template->tax_amount,
                'discount_amount' => $template->discount_amount,
                'total_amount' => $template->total_amount,
                'payment_method' => $template->payment_method,
                'payment_account' => $template->payment_account,
                'invoice_number' => null,
                'invoice_date' => null,
                'is_recurring' => false,
                'approval_status' => 'pending_approval',
                'expense_status' => 'pending_approval',
                'remarks' => "Auto-generated from recurring expense #{$template->expense_number}",
                'created_by' => $template->created_by,
                'updated_by' => $template->created_by,
            ]);

            $template->update(['next_due_date' => $nextDue]);
        }
    }

    private function calculateNextDueDate(string $currentDue, string $frequency): string
    {
        $date = \Carbon\Carbon::parse($currentDue);

        return match ($frequency) {
            'weekly' => $date->addWeek()->toDateString(),
            'biweekly' => $date->addWeeks(2)->toDateString(),
            'monthly' => $date->addMonthNoOverflow()->toDateString(),
            'quarterly' => $date->addMonthsNoOverflow(3)->toDateString(),
            'yearly' => $date->addYearNoOverflow()->toDateString(),
            default => $date->addMonthNoOverflow()->toDateString(),
        };
    }

    private function generateExpenseNumber(): string
    {
        $date = now()->format('Ymd');
        $prefix = "EXP-{$date}-";

        $last = Expense::where('expense_number', 'LIKE', "{$prefix}%")
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
}
