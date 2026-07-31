<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\DeliveryZone\DeliveryZoneRepositoryInterface;
use App\Repositories\DeliveryZone\DeliveryZoneRepository;
use App\Services\DeliveryZone\DeliveryZoneServiceInterface;
use App\Services\DeliveryZone\DeliveryZoneService;
use App\Models\DeliveryZone;

class DeliveryZoneServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DeliveryZoneRepositoryInterface::class, DeliveryZoneRepository::class);
        $this->app->bind(DeliveryZoneServiceInterface::class, DeliveryZoneService::class);
    }

    public function boot(): void
    {
        $this->registerPolicies();
    }

    protected function registerPolicies(): void
    {
        //
    }
}
