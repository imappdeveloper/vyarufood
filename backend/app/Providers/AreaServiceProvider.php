<?php
declare(strict_types=1);
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Area\AreaRepositoryInterface;
use App\Repositories\Area\AreaRepository;
use App\Services\Area\AreaServiceInterface;
use App\Services\Area\AreaService;

class AreaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AreaRepositoryInterface::class, AreaRepository::class);
        $this->app->bind(AreaServiceInterface::class, AreaService::class);
    }
}
