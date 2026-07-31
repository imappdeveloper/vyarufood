<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\KitchenCapacity;

class KitchenCapacityObserver
{
    public function created(KitchenCapacity $model): void
    {
        // cache handled by service
    }

    public function updated(KitchenCapacity $model): void
    {
        // cache handled by service
    }

    public function deleted(KitchenCapacity $model): void
    {
        // cache handled by service
    }
}
