<?php

declare(strict_types=1);

namespace App\Listeners\ProductionBatch;

use Illuminate\Support\Facades\Log;

class LogProductionActivity
{
    public function handle(mixed $event): void
    {
        $batch = $event->batch ?? null;
        $className = class_basename($event::class);

        Log::info("[production_batch] {$className}", [
            'batch_id' => $batch?->id,
            'batch_number' => $batch?->batch_number,
            'status' => $batch?->production_status ?? null,
        ]);
    }
}
