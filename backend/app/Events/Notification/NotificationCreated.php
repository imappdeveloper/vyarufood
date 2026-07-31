<?php

declare(strict_types=1);

namespace App\Events\Notification;

use App\Models\Notification;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public Notification $notification) {}
}
