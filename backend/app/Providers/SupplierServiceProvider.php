<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Supplier\{SupplierRepositoryInterface, SupplierRepository, SupplierProductRepositoryInterface, SupplierProductRepository, SupplierDocumentRepositoryInterface, SupplierDocumentRepository, SupplierContactRepositoryInterface, SupplierContactRepository};
use App\Services\Supplier\{SupplierServiceInterface, SupplierService, SupplierProductServiceInterface, SupplierProductService, SupplierDocumentServiceInterface, SupplierDocumentService, SupplierContactServiceInterface, SupplierContactService};
use Illuminate\Support\ServiceProvider;

class SupplierServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SupplierRepositoryInterface::class, SupplierRepository::class);
        $this->app->bind(SupplierProductRepositoryInterface::class, SupplierProductRepository::class);
        $this->app->bind(SupplierDocumentRepositoryInterface::class, SupplierDocumentRepository::class);
        $this->app->bind(SupplierContactRepositoryInterface::class, SupplierContactRepository::class);

        $this->app->bind(SupplierServiceInterface::class, SupplierService::class);
        $this->app->bind(SupplierProductServiceInterface::class, SupplierProductService::class);
        $this->app->bind(SupplierDocumentServiceInterface::class, SupplierDocumentService::class);
        $this->app->bind(SupplierContactServiceInterface::class, SupplierContactService::class);
    }

    public function boot(): void
    {
        //
    }
}
