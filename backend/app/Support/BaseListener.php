<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Contracts\Queue\ShouldQueue;

abstract class BaseListener implements ShouldQueue
{
    public int $tries = 3;
    public int $timeout = 60;

    abstract public function handle(object $event): void;

    public function failed(object $event, \Throwable $exception): void
    {
        \Log::error("Listener failed: " . static::class, [
            'event' => get_class($event),
            'error' => $exception->getMessage(),
        ]);
    }
}
