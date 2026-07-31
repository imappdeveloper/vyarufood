<?php
declare(strict_types=1);
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Country\CountryRepositoryInterface;
use App\Repositories\Country\CountryRepository;
use App\Services\Country\CountryServiceInterface;
use App\Services\Country\CountryService;

class CountryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CountryRepositoryInterface::class, CountryRepository::class);
        $this->app->bind(CountryServiceInterface::class, CountryService::class);
    }
}
