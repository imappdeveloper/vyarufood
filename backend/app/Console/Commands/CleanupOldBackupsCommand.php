<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\SystemBackup\SystemBackupServiceInterface;
use Illuminate\Console\Command;

class CleanupOldBackupsCommand extends Command
{
    protected $signature = 'backup:cleanup {--days=30 : Number of days to retain backups}';
    protected $description = 'Clean up old backups beyond retention period';

    public function __construct(private SystemBackupServiceInterface $backupService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $days = (int) $this->option('days');

        $this->info("Cleaning up backups older than {$days} days...");

        try {
            $count = $this->backupService->cleanupOldBackups($days);
            $this->info("Deleted {$count} old backup(s).");
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Cleanup failed: {$e->getMessage()}");
            return Command::FAILURE;
        }
    }
}
