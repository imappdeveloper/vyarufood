<?php

declare(strict_types=1);

namespace App\Listeners\Kitchen;

use Illuminate\Support\Facades\Log;

class LogKitchenHolidayActivity
{
    public function handle(object $event): void
    {
        $holiday = $event->holiday ?? null;
        $action = class_basename($event);
        Log::info("Kitchen holiday activity: {$action}", [
            'kitchen_holiday_id' => $holiday?->id,
            'kitchen_id' => $holiday?->kitchen_id,
            'holiday_name' => $holiday?->holiday_name,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
