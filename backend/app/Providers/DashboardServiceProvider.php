<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Dashboard\DashboardRepositoryInterface;
use App\Repositories\Dashboard\DashboardRepository;
use App\Services\Dashboard\DashboardServiceInterface;
use App\Services\Dashboard\DashboardService;

class DashboardServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DashboardRepositoryInterface::class, DashboardRepository::class);
        $this->app->bind(DashboardServiceInterface::class, DashboardService::class);
    }

    public function boot(): void
    {
    }
}
