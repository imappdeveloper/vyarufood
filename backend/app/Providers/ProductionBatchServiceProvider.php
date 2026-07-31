<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\ProductionBatch\ProductionBatchRepository;
use App\Repositories\ProductionBatch\ProductionBatchRepositoryInterface;
use App\Services\ProductionBatch\ProductionBatchService;
use App\Services\ProductionBatch\ProductionBatchServiceInterface;
use Illuminate\Support\ServiceProvider;

class ProductionBatchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductionBatchRepositoryInterface::class, ProductionBatchRepository::class);
        $this->app->bind(ProductionBatchServiceInterface::class, ProductionBatchService::class);
    }

    public function boot(): void
    {
        //
    }
}
