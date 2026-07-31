<?php

declare(strict_types=1);

namespace App\Listeners\Notification;

use Illuminate\Support\Facades\Log;

class LogNotificationActivity
{
    public function handle(object $event): void
    {
        $notification = $event->notification ?? null;
        $action = class_basename($event);

        Log::info("Notification activity: {$action}", [
            'notification_id' => $notification?->id,
            'notification_number' => $notification?->notification_number,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
