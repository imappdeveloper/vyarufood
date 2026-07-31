<?php

declare(strict_types=1);

namespace App\Listeners\AppVersion;

use App\Events\AppVersion\AppVersionCreated;
use App\Events\AppVersion\AppVersionStatusChanged;
use App\Events\AppVersion\AppVersionUpdated;
use App\Support\BaseListener;

class LogAppVersionActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match (true) {
            $event instanceof AppVersionCreated => "App version '{$event->version->version_name}' ({$event->version->platform}) created",
            $event instanceof AppVersionUpdated => "App version '{$event->version->version_name}' ({$event->version->platform}) updated",
            $event instanceof AppVersionStatusChanged => "App version '{$event->version->version_name}' status changed from '{$event->oldStatus}' to '{$event->newStatus}'",
            default => 'App version activity',
        };

        activity('app_version')
            ->performedOn($event->version ?? null)
            ->event(class_basename($event))
            ->log($description);
    }
}
