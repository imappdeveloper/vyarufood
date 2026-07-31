<?php

declare(strict_types=1);

namespace App\Jobs\Report;

use App\Services\Report\ScheduleServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessScheduledReportsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 300;

    public function __construct() {}

    public function handle(ScheduleServiceInterface $scheduleService): void
    {
        Log::info('Processing ProcessScheduledReportsJob');

        try {
            $processedCount = $scheduleService->processDueReports();

            Log::info('ProcessScheduledReportsJob completed', [
                'processed_count' => $processedCount,
            ]);
        } catch (\Exception $e) {
            Log::error('ProcessScheduledReportsJob failed', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessScheduledReportsJob permanently failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
