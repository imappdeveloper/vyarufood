<?php

declare(strict_types=1);

namespace App\Listeners\Kitchen;

use App\Support\CacheManager;

class ClearKitchenHolidayCache
{
    public function handle(object $event): void
    {
        CacheManager::flush('kitchen_holiday');
    }
}
