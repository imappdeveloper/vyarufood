<?php

declare(strict_types=1);

namespace App\Listeners\Kitchen;

use Illuminate\Support\Facades\Log;

class LogKitchenWorkingDayActivity
{
    public function handle(object $event): void
    {
        $workingDay = $event->workingDay ?? null;
        $action = class_basename($event);
        Log::info("Kitchen working day activity: {$action}", [
            'kitchen_working_day_id' => $workingDay?->id,
            'kitchen_id' => $workingDay?->kitchen_id,
            'day_of_week' => $workingDay?->day_of_week,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
