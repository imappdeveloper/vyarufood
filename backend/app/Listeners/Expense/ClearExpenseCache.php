<?php

declare(strict_types=1);

namespace App\Listeners\Expense;

use App\Events\Expense\ExpenseCreated;
use App\Events\Expense\ExpenseUpdated;
use App\Support\CacheManager;

class ClearExpenseCache
{
    public function handle(ExpenseCreated|ExpenseUpdated $event): void
    {
        CacheManager::flush('expense');
    }
}
