<?php

declare(strict_types=1);

namespace App\Listeners\SystemBackup;

use App\Events\SystemBackup\BackupCompleted;
use App\Events\SystemBackup\BackupCreated;
use App\Events\SystemBackup\BackupFailed;
use App\Support\BaseListener;

class LogSystemBackupActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match (true) {
            $event instanceof BackupCreated => "Backup '{$event->backup->backup_name}' initiated",
            $event instanceof BackupCompleted => "Backup '{$event->backup->backup_name}' completed",
            $event instanceof BackupFailed => "Backup '{$event->backup->backup_name}' failed: {$event->errorMessage}",
            default => 'Backup activity',
        };

        activity('system_backup')
            ->performedOn($event->backup ?? null)
            ->event(class_basename($event))
            ->log($description);
    }
}
