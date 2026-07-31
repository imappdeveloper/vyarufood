<?php
declare(strict_types=1);
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Repositories\City\CityRepositoryInterface;
use App\Repositories\City\CityRepository;
use App\Services\City\CityServiceInterface;
use App\Services\City\CityService;

class CityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CityRepositoryInterface::class, CityRepository::class);
        $this->app->bind(CityServiceInterface::class, CityService::class);
    }
}
