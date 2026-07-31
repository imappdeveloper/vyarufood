<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ProductionSchedule;

class ProductionScheduleObserver
{
    public function created(ProductionSchedule $model): void
    {
        // cache handled by service
    }

    public function updated(ProductionSchedule $model): void
    {
        // cache handled by service
    }

    public function deleted(ProductionSchedule $model): void
    {
        // cache handled by service
    }
}
