<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Purchase\{PurchaseRequestRepository, PurchaseRequestRepositoryInterface, PurchaseOrderRepository, PurchaseOrderRepositoryInterface, GoodsReceiptRepository, GoodsReceiptRepositoryInterface};
use App\Services\Purchase\{PurchaseRequestService, PurchaseRequestServiceInterface, PurchaseOrderService, PurchaseOrderServiceInterface, GoodsReceiptService, GoodsReceiptServiceInterface};
use Illuminate\Support\ServiceProvider;

class PurchaseServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PurchaseRequestRepositoryInterface::class, PurchaseRequestRepository::class);
        $this->app->bind(PurchaseOrderRepositoryInterface::class, PurchaseOrderRepository::class);
        $this->app->bind(GoodsReceiptRepositoryInterface::class, GoodsReceiptRepository::class);
        $this->app->bind(PurchaseRequestServiceInterface::class, PurchaseRequestService::class);
        $this->app->bind(PurchaseOrderServiceInterface::class, PurchaseOrderService::class);
        $this->app->bind(GoodsReceiptServiceInterface::class, GoodsReceiptService::class);
    }

    public function boot(): void
    {
        //
    }
}
