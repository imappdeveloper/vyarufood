<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\CustomerAddress\CustomerAddressRepositoryInterface;
use App\Repositories\CustomerAddress\CustomerAddressRepository;
use App\Services\CustomerAddress\CustomerAddressServiceInterface;
use App\Services\CustomerAddress\CustomerAddressService;
use App\Models\CustomerAddress;
use App\Observers\CustomerAddressObserver;

class CustomerAddressServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerAddressRepositoryInterface::class, CustomerAddressRepository::class);
        $this->app->bind(CustomerAddressServiceInterface::class, CustomerAddressService::class);
    }

    public function boot(): void
    {
        CustomerAddress::observe(CustomerAddressObserver::class);
    }
}
