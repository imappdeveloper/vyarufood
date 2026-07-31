<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\FinancialYear;
use App\Events\Finance\FinancialYearCreated;
use App\Events\Finance\FinancialYearUpdated;
use App\Events\Finance\FinancialYearClosed;

class FinancialYearObserver
{
    public function created(FinancialYear $financialYear): void
    {
        event(new FinancialYearCreated($financialYear));
    }

    public function updated(FinancialYear $financialYear): void
    {
        event(new FinancialYearUpdated($financialYear));

        if ($financialYear->wasChanged('is_closed') && $financialYear->is_closed) {
            event(new FinancialYearClosed($financialYear));
        }
    }
}
