<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\ProductionBatch\ProductionBatchServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateProductionBatchesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    public function __construct(
        public string $date,
        public ?int $kitchenId = null,
    ) {}

    public function handle(ProductionBatchServiceInterface $batchService): void
    {
        try {
            $batch = $batchService->generateFromOrders($this->date, $this->kitchenId);

            Log::info("[production_batch] Daily production batch generated via job", [
                'batch_number' => $batch->batch_number,
                'date' => $this->date,
                'meals' => $batch->total_meals,
            ]);
        } catch (\RuntimeException $e) {
            Log::warning("[production_batch] No orders to generate batch", [
                'date' => $this->date,
                'message' => $e->getMessage(),
            ]);
        } catch (\Exception $e) {
            Log::error("[production_batch] Failed to generate batch via job", [
                'date' => $this->date,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("[production_batch] Job failed", [
            'date' => $this->date,
            'error' => $exception->getMessage(),
        ]);
    }
}
