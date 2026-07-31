<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ChartOfAccount;
use App\Events\Finance\ChartOfAccountCreated;
use App\Events\Finance\ChartOfAccountUpdated;
use App\Events\Finance\ChartOfAccountDeleted;

class ChartOfAccountObserver
{
    public function created(ChartOfAccount $chartOfAccount): void
    {
        event(new ChartOfAccountCreated($chartOfAccount));
    }

    public function updated(ChartOfAccount $chartOfAccount): void
    {
        event(new ChartOfAccountUpdated($chartOfAccount));
    }

    public function deleted(ChartOfAccount $chartOfAccount): void
    {
        event(new ChartOfAccountDeleted($chartOfAccount));
    }
}
