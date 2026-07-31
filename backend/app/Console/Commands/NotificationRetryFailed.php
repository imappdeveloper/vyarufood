<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\Notification\RetryFailedNotificationsJob;
use Illuminate\Console\Command;

class NotificationRetryFailed extends Command
{
    protected $signature = 'notifications:retry-failed';

    protected $description = 'Retry all failed notifications';

    public function handle(): int
    {
        RetryFailedNotificationsJob::dispatch();

        $this->info('Retry failed notifications job has been dispatched.');

        return Command::SUCCESS;
    }
}
