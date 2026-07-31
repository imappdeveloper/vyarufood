<?php

declare(strict_types=1);

namespace App\Listeners\Notification;

use App\Support\CacheManager;
use Illuminate\Support\Facades\Log;

class ClearNotificationCache
{
    public function handle(object $event): void
    {
        Log::info('Clearing notification cache', [
            'module' => 'notification',
            'event' => class_basename($event),
        ]);

        CacheManager::flush('notification');
    }
}
