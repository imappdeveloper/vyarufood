<?php
declare(strict_types=1);
namespace App\Listeners\Meal;
use Illuminate\Support\Facades\Log;
class LogMealCategoryActivity {
    public function handle(object $event): void {
        $mealCategory = $event->mealCategory ?? null;
        $action = class_basename($event);
        Log::info("Meal category activity: {$action}", [
            'meal_category_id' => $mealCategory?->id,
            'category_code' => $mealCategory?->category_code,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
