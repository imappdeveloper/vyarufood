<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ProductionBatch;
use App\Support\CacheManager;

class ProductionBatchObserver
{
    public function created(ProductionBatch $batch): void
    {
        CacheManager::flush('production');
    }

    public function updated(ProductionBatch $batch): void
    {
        CacheManager::flush('production');
    }

    public function deleted(ProductionBatch $batch): void
    {
        CacheManager::flush('production');
    }

    public function restored(ProductionBatch $batch): void
    {
        CacheManager::flush('production');
    }
}
