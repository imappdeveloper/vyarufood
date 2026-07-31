<?php

declare(strict_types=1);

namespace App\Listeners\Kitchen;

use Illuminate\Support\Facades\Log;

class LogKitchenCapacityActivity
{
    public function handle(object $event): void
    {
        $capacity = $event->capacity ?? null;
        $action = class_basename($event);
        Log::info("Kitchen capacity activity: {$action}", [
            'kitchen_capacity_id' => $capacity?->id,
            'kitchen_id' => $capacity?->kitchen_id,
            'capacity_date' => $capacity?->capacity_date,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
