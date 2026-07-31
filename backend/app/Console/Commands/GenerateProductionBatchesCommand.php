<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\ProductionBatch\ProductionBatchServiceInterface;
use Illuminate\Console\Command;

class GenerateProductionBatchesCommand extends Command
{
    protected $signature = 'production:generate-daily {--date=} {--kitchen=}';
    protected $description = 'Generate production batches from confirmed daily orders';

    public function handle(ProductionBatchServiceInterface $batchService): int
    {
        $date = $this->option('date') ?? now()->toDateString();
        $kitchenId = $this->option('kitchen') ? (int) $this->option('kitchen') : null;

        try {
            $batch = $batchService->generateFromOrders($date, $kitchenId);

            $this->info("Production batch {$batch->batch_number} generated for {$date} with {$batch->total_meals} meals.");

            return Command::SUCCESS;
        } catch (\RuntimeException $e) {
            $this->error($e->getMessage());

            return Command::FAILURE;
        }
    }
}
