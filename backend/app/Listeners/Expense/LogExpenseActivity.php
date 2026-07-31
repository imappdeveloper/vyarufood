<?php

declare(strict_types=1);

namespace App\Listeners\Expense;

use App\Events\Expense\ExpenseCreated;
use App\Events\Expense\ExpenseUpdated;
use Illuminate\Support\Facades\Log;

class LogExpenseActivity
{
    public function handle(ExpenseCreated|ExpenseUpdated $event): void
    {
        $expense = $event->expense;
        $action = $event instanceof ExpenseCreated ? 'created' : 'updated';

        Log::info("[expense] Expense {$action}", [
            'expense_id' => $expense->id,
            'expense_number' => $expense->expense_number,
            'total_amount' => $expense->total_amount,
        ]);
    }
}
