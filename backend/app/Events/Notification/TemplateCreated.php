<?php

declare(strict_types=1);

namespace App\Events\Notification;

use App\Models\NotificationTemplate;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TemplateCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public NotificationTemplate $template) {}
}
