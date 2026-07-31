<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Master\DeliveryZone;

class DeliveryZoneObserver
{
    public function created(DeliveryZone $deliveryZone): void
    {
        \Log::info('Delivery zone created', [
            'module' => 'delivery_zone',
            'data' => $deliveryZone->toArray(),
        ]);

        \Log::activity('delivery_zone', 'created', $deliveryZone->toArray());
    }

    public function updated(DeliveryZone $deliveryZone): void
    {
        \Log::info('Delivery zone updated', [
            'module' => 'delivery_zone',
            'data' => $deliveryZone->toArray(),
        ]);

        \Log::activity('delivery_zone', 'updated', $deliveryZone->toArray());
    }

    public function deleted(DeliveryZone $deliveryZone): void
    {
        \Log::info('Delivery zone deleted', [
            'module' => 'delivery_zone',
            'id' => $deliveryZone->id,
        ]);

        \Log::activity('delivery_zone', 'deleted', ['id' => $deliveryZone->id]);
    }

    public function restoring(DeliveryZone $deliveryZone): void
    {
        \Log::info('Delivery zone restoring', [
            'module' => 'delivery_zone',
            'id' => $deliveryZone->id,
        ]);

        \Log::activity('delivery_zone', 'restoring', ['id' => $deliveryZone->id]);
    }

    public function restored(DeliveryZone $deliveryZone): void
    {
        \Log::info('Delivery zone restored', [
            'module' => 'delivery_zone',
            'id' => $deliveryZone->id,
        ]);

        \Log::activity('delivery_zone', 'restored', ['id' => $deliveryZone->id]);
    }

    public function forceDeleted(DeliveryZone $deliveryZone): void
    {
        \Log::info('Delivery zone force deleted', [
            'module' => 'delivery_zone',
            'id' => $deliveryZone->id,
        ]);

        \Log::activity('delivery_zone', 'force_deleted', ['id' => $deliveryZone->id]);
    }
}
