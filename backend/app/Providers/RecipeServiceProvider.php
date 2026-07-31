<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Recipe\RecipeRepository;
use App\Repositories\Recipe\RecipeRepositoryInterface;
use App\Services\Recipe\RecipeService;
use App\Services\Recipe\RecipeServiceInterface;
use Illuminate\Support\ServiceProvider;

class RecipeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(RecipeRepositoryInterface::class, RecipeRepository::class);
        $this->app->bind(RecipeServiceInterface::class, RecipeService::class);
    }

    public function boot(): void
    {
        //
    }
}
