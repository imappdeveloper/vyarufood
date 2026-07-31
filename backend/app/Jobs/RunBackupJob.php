<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\SystemBackup;
use App\Services\SystemBackup\SystemBackupServiceInterface;
use App\Support\BaseJob;

class RunBackupJob extends BaseJob
{
    public int $tries = 1;
    public int $timeout = 600;

    public function __construct(public readonly SystemBackup $backup) {}

    public function handle(SystemBackupServiceInterface $backupService): void
    {
        $backupService->runBackup($this->backup);
    }

    public function failed(\Throwable $exception): void
    {
        $this->backup->update([
            'status' => 'failed',
            'error_message' => $exception->getMessage(),
            'completed_at' => now(),
        ]);

        parent::failed($exception);
    }
}
