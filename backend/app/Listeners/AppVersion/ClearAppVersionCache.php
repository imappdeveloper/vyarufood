<?php

declare(strict_types=1);

namespace App\Listeners\AppVersion;

use App\Support\BaseListener;
use App\Support\CacheManager;

class ClearAppVersionCache extends BaseListener
{
    public function handle(object $event): void
    {
        CacheManager::flush('app_version');
    }
}
