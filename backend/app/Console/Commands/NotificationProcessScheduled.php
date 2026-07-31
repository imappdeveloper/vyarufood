<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\Notification\ProcessScheduledNotificationsJob;
use Illuminate\Console\Command;

class NotificationProcessScheduled extends Command
{
    protected $signature = 'notifications:process-scheduled';

    protected $description = 'Process scheduled notifications that are due';

    public function handle(): int
    {
        ProcessScheduledNotificationsJob::dispatch();

        $this->info('Process scheduled notifications job has been dispatched.');

        return Command::SUCCESS;
    }
}
