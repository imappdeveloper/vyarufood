<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\MealCategory;

class MealCategoryObserver
{
    public function created(MealCategory $mealCategory): void
    {
        \Log::info('Meal category created', [
            'module' => 'meal_category',
            'data' => $mealCategory->toArray(),
        ]);
    }

    public function updated(MealCategory $mealCategory): void
    {
        \Log::info('Meal category updated', [
            'module' => 'meal_category',
            'data' => $mealCategory->toArray(),
        ]);
    }

    public function deleted(MealCategory $mealCategory): void
    {
        \Log::info('Meal category deleted', [
            'module' => 'meal_category',
            'id' => $mealCategory->id,
        ]);
    }

    public function restoring(MealCategory $mealCategory): void
    {
        \Log::info('Meal category restoring', [
            'module' => 'meal_category',
            'id' => $mealCategory->id,
        ]);
    }

    public function restored(MealCategory $mealCategory): void
    {
        \Log::info('Meal category restored', [
            'module' => 'meal_category',
            'id' => $mealCategory->id,
        ]);
    }

    public function forceDeleted(MealCategory $mealCategory): void
    {
        \Log::info('Meal category force deleted', [
            'module' => 'meal_category',
            'id' => $mealCategory->id,
        ]);
    }
}
