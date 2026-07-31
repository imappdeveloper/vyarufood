<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use App\Repositories\SubscriptionPlan\SubscriptionPlanRepository;
use App\Repositories\SubscriptionPlan\SubscriptionPlanMealRepositoryInterface;
use App\Repositories\SubscriptionPlan\SubscriptionPlanMealRepository;
use App\Services\SubscriptionPlan\SubscriptionPlanServiceInterface;
use App\Services\SubscriptionPlan\SubscriptionPlanService;
use App\Services\SubscriptionPlan\SubscriptionPlanMealService;

class SubscriptionPlanServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SubscriptionPlanRepositoryInterface::class, SubscriptionPlanRepository::class);
        $this->app->bind(SubscriptionPlanMealRepositoryInterface::class, SubscriptionPlanMealRepository::class);
        $this->app->bind(SubscriptionPlanServiceInterface::class, SubscriptionPlanService::class);
    }

    public function boot(): void {}
}
