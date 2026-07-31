<?php
declare(strict_types=1);
namespace App\Listeners\Meal;
use Illuminate\Support\Facades\Log;
class LogMealTypeActivity {
    public function handle(object $event): void {
        $mealType = $event->mealType ?? null;
        $action = class_basename($event);
        Log::info("Meal type activity: {$action}", [
            'meal_type_id' => $mealType?->id,
            'type_code' => $mealType?->type_code,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
