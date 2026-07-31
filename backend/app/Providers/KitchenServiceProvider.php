<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Kitchen\KitchenRepositoryInterface;
use App\Repositories\Kitchen\KitchenRepository;
use App\Services\Kitchen\KitchenServiceInterface;
use App\Services\Kitchen\KitchenService;
use App\Models\Kitchen;
use App\Observers\KitchenObserver;

class KitchenServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KitchenRepositoryInterface::class, KitchenRepository::class);
        $this->app->bind(KitchenServiceInterface::class, KitchenService::class);
    }

    public function boot(): void
    {
        Kitchen::observe(KitchenObserver::class);
    }
}
