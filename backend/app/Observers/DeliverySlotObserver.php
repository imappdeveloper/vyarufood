<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Master\DeliverySlot;

class DeliverySlotObserver
{
    public function created(DeliverySlot $deliverySlot): void
    {
        \Log::info('Delivery slot created', [
            'module' => 'delivery_slot',
            'data' => $deliverySlot->toArray(),
        ]);

        \Log::activity('delivery_slot', 'created', $deliverySlot->toArray());
    }

    public function updated(DeliverySlot $deliverySlot): void
    {
        \Log::info('Delivery slot updated', [
            'module' => 'delivery_slot',
            'data' => $deliverySlot->toArray(),
        ]);

        \Log::activity('delivery_slot', 'updated', $deliverySlot->toArray());
    }

    public function deleted(DeliverySlot $deliverySlot): void
    {
        \Log::info('Delivery slot deleted', [
            'module' => 'delivery_slot',
            'id' => $deliverySlot->id,
        ]);

        \Log::activity('delivery_slot', 'deleted', ['id' => $deliverySlot->id]);
    }

    public function restoring(DeliverySlot $deliverySlot): void
    {
        \Log::info('Delivery slot restoring', [
            'module' => 'delivery_slot',
            'id' => $deliverySlot->id,
        ]);

        \Log::activity('delivery_slot', 'restoring', ['id' => $deliverySlot->id]);
    }

    public function restored(DeliverySlot $deliverySlot): void
    {
        \Log::info('Delivery slot restored', [
            'module' => 'delivery_slot',
            'id' => $deliverySlot->id,
        ]);

        \Log::activity('delivery_slot', 'restored', ['id' => $deliverySlot->id]);
    }

    public function forceDeleted(DeliverySlot $deliverySlot): void
    {
        \Log::info('Delivery slot force deleted', [
            'module' => 'delivery_slot',
            'id' => $deliverySlot->id,
        ]);

        \Log::activity('delivery_slot', 'force_deleted', ['id' => $deliverySlot->id]);
    }
}
