<?php

declare(strict_types=1);

namespace App\Events\Expense;

use App\Models\Expense;
use Illuminate\Foundation\Events\Dispatchable;

class ExpenseApproved
{
    use Dispatchable;

    public function __construct(public Expense $expense) {}
}
