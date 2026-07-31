<?php

declare(strict_types=1);

namespace App\Listeners\Supplier;

use App\Support\BaseListener;
use App\Support\CacheManager;

class ClearSupplierCache extends BaseListener
{
    public function handle(object $event): void
    {
        CacheManager::flush('supplier');
    }
}
