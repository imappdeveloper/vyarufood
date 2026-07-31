<?php

declare(strict_types=1);

namespace App\Listeners\Kitchen;

use Illuminate\Support\Facades\Log;

class LogProductionScheduleActivity
{
    public function handle(object $event): void
    {
        $schedule = $event->schedule ?? null;
        $action = class_basename($event);
        Log::info("Production schedule activity: {$action}", [
            'production_schedule_id' => $schedule?->id,
            'kitchen_id' => $schedule?->kitchen_id,
            'meal_type' => $schedule?->meal_type,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
