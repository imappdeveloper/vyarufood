<?php
declare(strict_types=1);
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Repositories\WeeklyMenu\WeeklyMenuRepositoryInterface;
use App\Repositories\WeeklyMenu\WeeklyMenuRepository;
use App\Repositories\WeeklyMenu\WeeklyMenuItemRepositoryInterface;
use App\Repositories\WeeklyMenu\WeeklyMenuItemRepository;
use App\Repositories\WeeklyMenu\CustomerMealSelectionRepositoryInterface;
use App\Repositories\WeeklyMenu\CustomerMealSelectionRepository;
use App\Services\WeeklyMenu\WeeklyMenuServiceInterface;
use App\Services\WeeklyMenu\WeeklyMenuService;
use App\Services\WeeklyMenu\WeeklyMenuItemServiceInterface;
use App\Services\WeeklyMenu\WeeklyMenuItemService;
use App\Services\WeeklyMenu\CustomerMealSelectionServiceInterface;
use App\Services\WeeklyMenu\CustomerMealSelectionService;
class WeeklyMenuServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(WeeklyMenuRepositoryInterface::class, WeeklyMenuRepository::class);
        $this->app->bind(WeeklyMenuItemRepositoryInterface::class, WeeklyMenuItemRepository::class);
        $this->app->bind(CustomerMealSelectionRepositoryInterface::class, CustomerMealSelectionRepository::class);
        $this->app->bind(WeeklyMenuServiceInterface::class, WeeklyMenuService::class);
        $this->app->bind(WeeklyMenuItemServiceInterface::class, WeeklyMenuItemService::class);
        $this->app->bind(CustomerMealSelectionServiceInterface::class, CustomerMealSelectionService::class);
    }
    public function boot(): void {}
}
