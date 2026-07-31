<?php
declare(strict_types=1);
namespace App\Listeners\DeliveryZone;
use Illuminate\Support\Facades\Log;
class LogDeliveryZoneActivity {
    public function handle(object $event): void {
        $deliveryZone = $event->deliveryZone ?? null;
        $action = class_basename($event);
        Log::info("DeliveryZone activity: {$action}", [
            'delivery_zone_id' => $deliveryZone?->id,
            'delivery_zone_name' => $deliveryZone?->name,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
