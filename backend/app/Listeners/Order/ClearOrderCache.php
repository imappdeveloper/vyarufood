<?php

declare(strict_types=1);

namespace App\Listeners\Order;

use App\Support\CacheManager;
use Illuminate\Support\Facades\Log;

class ClearOrderCache
{
    public function handle(object $event): void
    {
        Log::info('Clearing order cache', [
            'module' => 'order',
            'event' => class_basename($event),
        ]);

        CacheManager::flush('order');
    }
}
