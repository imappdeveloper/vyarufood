<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\Report\ProcessScheduledReportsJob;
use Illuminate\Console\Command;

class ReportProcessScheduled extends Command
{
    protected $signature = 'reports:process-scheduled';

    protected $description = 'Process due scheduled reports and generate exports';

    public function handle(): int
    {
        ProcessScheduledReportsJob::dispatch();

        $this->info('Process scheduled reports job has been dispatched.');

        return Command::SUCCESS;
    }
}
