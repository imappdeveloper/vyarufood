<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\KitchenWorkingDay;

class KitchenWorkingDayObserver
{
    public function created(KitchenWorkingDay $model): void
    {
        // cache handled by service
    }

    public function updated(KitchenWorkingDay $model): void
    {
        // cache handled by service
    }

    public function deleted(KitchenWorkingDay $model): void
    {
        // cache handled by service
    }
}
