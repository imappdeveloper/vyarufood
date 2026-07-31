<?php

declare(strict_types=1);

namespace App\Listeners\Inventory;

use App\Support\CacheManager;

class ClearInventoryCache
{
    public function handle(mixed $event): void
    {
        CacheManager::flush('inventory');
    }
}
