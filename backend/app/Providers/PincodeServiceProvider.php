<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Pincode\PincodeRepositoryInterface;
use App\Repositories\Pincode\PincodeRepository;
use App\Services\Pincode\PincodeServiceInterface;
use App\Services\Pincode\PincodeService;

class PincodeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PincodeRepositoryInterface::class, PincodeRepository::class);
        $this->app->bind(PincodeServiceInterface::class, PincodeService::class);
    }

    public function boot(): void
    {
    }
}
