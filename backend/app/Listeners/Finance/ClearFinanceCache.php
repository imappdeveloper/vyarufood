<?php

declare(strict_types=1);

namespace App\Listeners\Finance;

use App\Events\Finance\ChartOfAccountCreated;
use App\Events\Finance\ChartOfAccountUpdated;
use App\Events\Finance\ChartOfAccountDeleted;
use App\Events\Finance\JournalEntryCreated;
use App\Events\Finance\JournalEntryUpdated;
use App\Events\Finance\JournalEntryPosted;
use App\Events\Finance\FinancialYearCreated;
use App\Events\Finance\FinancialYearUpdated;
use App\Events\Finance\FinancialYearClosed;
use App\Support\CacheManager;

class ClearFinanceCache
{
    public function handle(
        ChartOfAccountCreated|ChartOfAccountUpdated|ChartOfAccountDeleted|
        JournalEntryCreated|JournalEntryUpdated|JournalEntryPosted|
        FinancialYearCreated|FinancialYearUpdated|FinancialYearClosed $event
    ): void {
        CacheManager::flush('finance');
    }
}
