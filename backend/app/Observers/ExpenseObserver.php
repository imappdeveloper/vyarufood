<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Expense;
use App\Events\Expense\ExpenseCreated;
use App\Events\Expense\ExpenseUpdated;

class ExpenseObserver
{
    public function created(Expense $expense): void
    {
        event(new ExpenseCreated($expense));
    }

    public function updated(Expense $expense): void
    {
        event(new ExpenseUpdated($expense));
    }
}
