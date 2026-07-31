<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\CustomerSubscription\CustomerSubscriptionRepositoryInterface;
use App\Repositories\CustomerSubscription\CustomerSubscriptionRepository;
use App\Services\CustomerSubscription\CustomerSubscriptionServiceInterface;
use App\Services\CustomerSubscription\CustomerSubscriptionService;

class CustomerSubscriptionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerSubscriptionRepositoryInterface::class, CustomerSubscriptionRepository::class);
        $this->app->bind(CustomerSubscriptionServiceInterface::class, CustomerSubscriptionService::class);
    }

    public function boot(): void {}
}
