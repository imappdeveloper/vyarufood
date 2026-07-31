<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Order\OrderRepository;
use App\Repositories\Order\OrderItemRepositoryInterface;
use App\Repositories\Order\OrderItemRepository;
use App\Services\Order\OrderServiceInterface;
use App\Services\Order\OrderService;

class OrderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(OrderItemRepositoryInterface::class, OrderItemRepository::class);
        $this->app->bind(OrderServiceInterface::class, OrderService::class);
    }

    public function boot(): void {}
}
