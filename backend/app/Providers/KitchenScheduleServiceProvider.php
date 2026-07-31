<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Kitchen\KitchenWorkingDayRepositoryInterface;
use App\Repositories\Kitchen\KitchenWorkingDayRepository;
use App\Repositories\Kitchen\KitchenHolidayRepositoryInterface;
use App\Repositories\Kitchen\KitchenHolidayRepository;
use App\Repositories\Kitchen\KitchenCapacityRepositoryInterface;
use App\Repositories\Kitchen\KitchenCapacityRepository;
use App\Repositories\Kitchen\ProductionScheduleRepositoryInterface;
use App\Repositories\Kitchen\ProductionScheduleRepository;
use App\Services\Kitchen\KitchenWorkingDayServiceInterface;
use App\Services\Kitchen\KitchenWorkingDayService;
use App\Services\Kitchen\KitchenHolidayServiceInterface;
use App\Services\Kitchen\KitchenHolidayService;
use App\Services\Kitchen\KitchenCapacityServiceInterface;
use App\Services\Kitchen\KitchenCapacityService;
use App\Services\Kitchen\ProductionScheduleServiceInterface;
use App\Services\Kitchen\ProductionScheduleService;
use App\Models\KitchenWorkingDay;
use App\Models\KitchenHoliday;
use App\Models\KitchenCapacity;
use App\Models\ProductionSchedule;
use App\Observers\KitchenWorkingDayObserver;
use App\Observers\KitchenHolidayObserver;
use App\Observers\KitchenCapacityObserver;
use App\Observers\ProductionScheduleObserver;

class KitchenScheduleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(KitchenWorkingDayRepositoryInterface::class, KitchenWorkingDayRepository::class);
        $this->app->bind(KitchenWorkingDayServiceInterface::class, KitchenWorkingDayService::class);

        $this->app->bind(KitchenHolidayRepositoryInterface::class, KitchenHolidayRepository::class);
        $this->app->bind(KitchenHolidayServiceInterface::class, KitchenHolidayService::class);

        $this->app->bind(KitchenCapacityRepositoryInterface::class, KitchenCapacityRepository::class);
        $this->app->bind(KitchenCapacityServiceInterface::class, KitchenCapacityService::class);

        $this->app->bind(ProductionScheduleRepositoryInterface::class, ProductionScheduleRepository::class);
        $this->app->bind(ProductionScheduleServiceInterface::class, ProductionScheduleService::class);
    }

    public function boot(): void
    {
        KitchenWorkingDay::observe(KitchenWorkingDayObserver::class);
        KitchenHoliday::observe(KitchenHolidayObserver::class);
        KitchenCapacity::observe(KitchenCapacityObserver::class);
        ProductionSchedule::observe(ProductionScheduleObserver::class);
    }
}
