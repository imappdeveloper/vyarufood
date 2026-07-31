<?php
declare(strict_types=1);
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Repositories\State\StateRepositoryInterface;
use App\Repositories\State\StateRepository;
use App\Services\State\StateServiceInterface;
use App\Services\State\StateService;

class StateServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(StateRepositoryInterface::class, StateRepository::class);
        $this->app->bind(StateServiceInterface::class, StateService::class);
    }
}
