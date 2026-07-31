<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Meal\MealCategoryRepositoryInterface;
use App\Repositories\Meal\MealCategoryRepository;
use App\Repositories\Meal\MealTypeRepositoryInterface;
use App\Repositories\Meal\MealTypeRepository;
use App\Repositories\Meal\MealRepositoryInterface;
use App\Repositories\Meal\MealRepository;
use App\Services\Meal\MealCategoryServiceInterface;
use App\Services\Meal\MealCategoryService;
use App\Services\Meal\MealTypeServiceInterface;
use App\Services\Meal\MealTypeService;
use App\Services\Meal\MealServiceInterface;
use App\Services\Meal\MealService;
use App\Models\MealCategory;
use App\Models\MealType;
use App\Models\Meal;
use App\Observers\MealCategoryObserver;
use App\Observers\MealTypeObserver;
use App\Observers\MealObserver;

class MealManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MealCategoryRepositoryInterface::class, MealCategoryRepository::class);
        $this->app->bind(MealCategoryServiceInterface::class, MealCategoryService::class);
        $this->app->bind(MealTypeRepositoryInterface::class, MealTypeRepository::class);
        $this->app->bind(MealTypeServiceInterface::class, MealTypeService::class);
        $this->app->bind(MealRepositoryInterface::class, MealRepository::class);
        $this->app->bind(MealServiceInterface::class, MealService::class);
    }

    public function boot(): void
    {
        MealCategory::observe(MealCategoryObserver::class);
        MealType::observe(MealTypeObserver::class);
        Meal::observe(MealObserver::class);
    }
}
