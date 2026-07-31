<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\KitchenHoliday;

class KitchenHolidayObserver
{
    public function created(KitchenHoliday $model): void
    {
        // cache handled by service
    }

    public function updated(KitchenHoliday $model): void
    {
        // cache handled by service
    }

    public function deleted(KitchenHoliday $model): void
    {
        // cache handled by service
    }
}
