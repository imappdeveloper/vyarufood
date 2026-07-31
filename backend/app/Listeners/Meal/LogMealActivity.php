<?php
declare(strict_types=1);
namespace App\Listeners\Meal;
use Illuminate\Support\Facades\Log;
class LogMealActivity {
    public function handle(object $event): void {
        $meal = $event->meal ?? null;
        $action = class_basename($event);
        Log::info("Meal activity: {$action}", [
            'meal_id' => $meal?->id,
            'meal_code' => $meal?->meal_code,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
