<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

abstract class BaseJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;
    public int $maxExceptions = 3;
    public string $jobName = 'base-job';

    public function __construct()
    {
        $this->jobName = static::class;
    }

    public function handle(): void
    {
        Log::info("Processing job: {$this->jobName}");
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Job failed: {$this->jobName}", [
            'message' => $exception->getMessage(),
            'exception' => get_class($exception),
        ]);
    }
}
