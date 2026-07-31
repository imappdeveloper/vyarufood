<?php

declare(strict_types=1);

namespace App\Observers;

use App\Events\Notification\NotificationCreated;
use App\Events\Notification\NotificationFailed;
use App\Events\Notification\NotificationRead;
use App\Events\Notification\NotificationSent;
use App\Models\Notification;

class NotificationObserver
{
    public function created(Notification $notification): void
    {
        NotificationCreated::dispatch($notification);
    }

    public function updated(Notification $notification): void
    {
        if ($notification->isDirty('delivery_status')) {
            match ($notification->delivery_status) {
                'sent' => NotificationSent::dispatch($notification),
                'failed' => NotificationFailed::dispatch($notification),
                'read' => NotificationRead::dispatch($notification),
                default => null,
            };
        }
    }
}
