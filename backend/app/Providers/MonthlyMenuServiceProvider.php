<?php
declare(strict_types=1);
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Repositories\MonthlyMenu\MonthlyMenuRepositoryInterface;
use App\Repositories\MonthlyMenu\MonthlyMenuRepository;
use App\Repositories\MonthlyMenu\MenuTemplateRepositoryInterface;
use App\Repositories\MonthlyMenu\MenuTemplateRepository;
use App\Services\MonthlyMenu\MonthlyMenuServiceInterface;
use App\Services\MonthlyMenu\MonthlyMenuService;
use App\Services\MonthlyMenu\MenuTemplateServiceInterface;
use App\Services\MonthlyMenu\MenuTemplateService;
class MonthlyMenuServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MonthlyMenuRepositoryInterface::class, MonthlyMenuRepository::class);
        $this->app->bind(MenuTemplateRepositoryInterface::class, MenuTemplateRepository::class);
        $this->app->bind(MonthlyMenuServiceInterface::class, MonthlyMenuService::class);
        $this->app->bind(MenuTemplateServiceInterface::class, MenuTemplateService::class);
    }
    public function boot(): void {}
}
