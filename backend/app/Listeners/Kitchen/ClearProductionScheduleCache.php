<?php

declare(strict_types=1);

namespace App\Listeners\Kitchen;

use App\Support\CacheManager;

class ClearProductionScheduleCache
{
    public function handle(object $event): void
    {
        CacheManager::flush('production_schedule');
    }
}
