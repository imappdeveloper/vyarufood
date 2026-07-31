<?php
declare(strict_types=1);
namespace App\Listeners\DeliveryZone;
use Illuminate\Support\Facades\Log;
class LogDeliverySlotActivity {
    public function handle(object $event): void {
        $deliverySlot = $event->deliverySlot ?? null;
        $action = class_basename($event);
        Log::info("DeliverySlot activity: {$action}", [
            'delivery_slot_id' => $deliverySlot?->id,
            'delivery_slot_name' => $deliverySlot?->name,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
