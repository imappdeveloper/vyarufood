<?php

declare(strict_types=1);

namespace App\Events\SystemBackup;

use App\Models\SystemBackup;
use App\Support\BaseEvent;

class BackupCompleted extends BaseEvent
{
    public function __construct(public readonly SystemBackup $backup) {}
}
