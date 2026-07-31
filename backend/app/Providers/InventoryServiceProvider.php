<?php
declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Inventory\InventoryItemRepositoryInterface;
use App\Repositories\Inventory\InventoryItemRepository;
use App\Repositories\Inventory\InventoryBatchRepositoryInterface;
use App\Repositories\Inventory\InventoryBatchRepository;
use App\Repositories\Inventory\InventoryTransactionRepositoryInterface;
use App\Repositories\Inventory\InventoryTransactionRepository;
use App\Repositories\Inventory\InventoryAdjustmentRepositoryInterface;
use App\Repositories\Inventory\InventoryAdjustmentRepository;
use App\Repositories\Inventory\StockAuditRepositoryInterface;
use App\Repositories\Inventory\StockAuditRepository;
use App\Services\Inventory\InventoryItemServiceInterface;
use App\Services\Inventory\InventoryItemService;
use App\Services\Inventory\InventoryBatchServiceInterface;
use App\Services\Inventory\InventoryBatchService;
use App\Services\Inventory\InventoryTransactionServiceInterface;
use App\Services\Inventory\InventoryTransactionService;
use App\Services\Inventory\InventoryAdjustmentServiceInterface;
use App\Services\Inventory\InventoryAdjustmentService;
use App\Services\Inventory\StockAuditServiceInterface;
use App\Services\Inventory\StockAuditService;

class InventoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(InventoryItemRepositoryInterface::class, InventoryItemRepository::class);
        $this->app->bind(InventoryBatchRepositoryInterface::class, InventoryBatchRepository::class);
        $this->app->bind(InventoryTransactionRepositoryInterface::class, InventoryTransactionRepository::class);
        $this->app->bind(InventoryAdjustmentRepositoryInterface::class, InventoryAdjustmentRepository::class);
        $this->app->bind(StockAuditRepositoryInterface::class, StockAuditRepository::class);

        $this->app->bind(InventoryItemServiceInterface::class, InventoryItemService::class);
        $this->app->bind(InventoryBatchServiceInterface::class, InventoryBatchService::class);
        $this->app->bind(InventoryTransactionServiceInterface::class, InventoryTransactionService::class);
        $this->app->bind(InventoryAdjustmentServiceInterface::class, InventoryAdjustmentService::class);
        $this->app->bind(StockAuditServiceInterface::class, StockAuditService::class);
    }

    public function boot(): void {}
}
