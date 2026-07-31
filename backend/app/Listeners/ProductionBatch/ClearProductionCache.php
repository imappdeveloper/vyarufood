<?php

declare(strict_types=1);

namespace App\Listeners\ProductionBatch;

use App\Events\ProductionBatch\{ProductionBatchCreated, ProductionBatchUpdated, ProductionBatchDeleted, ProductionStatusChanged, ProductionBatchCompleted, ProductionBatchCancelled};
use App\Support\CacheManager;

class ClearProductionCache
{
    public function handle(mixed $event): void
    {
        CacheManager::flush('production');
    }
}
