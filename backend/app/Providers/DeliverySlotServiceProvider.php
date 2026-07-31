<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\DeliveryZone\DeliverySlotRepositoryInterface;
use App\Repositories\DeliveryZone\DeliverySlotRepository;
use App\Services\DeliveryZone\DeliverySlotServiceInterface;
use App\Services\DeliveryZone\DeliverySlotService;

class DeliverySlotServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DeliverySlotRepositoryInterface::class, DeliverySlotRepository::class);
        $this->app->bind(DeliverySlotServiceInterface::class, DeliverySlotService::class);
    }

    public function boot(): void
    {
    }
}
