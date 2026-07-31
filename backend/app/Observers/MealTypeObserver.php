<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\MealType;

class MealTypeObserver
{
    public function created(MealType $mealType): void
    {
        \Log::info('Meal type created', [
            'module' => 'meal_type',
            'data' => $mealType->toArray(),
        ]);
    }

    public function updated(MealType $mealType): void
    {
        \Log::info('Meal type updated', [
            'module' => 'meal_type',
            'data' => $mealType->toArray(),
        ]);
    }

    public function deleted(MealType $mealType): void
    {
        \Log::info('Meal type deleted', [
            'module' => 'meal_type',
            'id' => $mealType->id,
        ]);
    }

    public function restoring(MealType $mealType): void
    {
        \Log::info('Meal type restoring', [
            'module' => 'meal_type',
            'id' => $mealType->id,
        ]);
    }

    public function restored(MealType $mealType): void
    {
        \Log::info('Meal type restored', [
            'module' => 'meal_type',
            'id' => $mealType->id,
        ]);
    }

    public function forceDeleted(MealType $mealType): void
    {
        \Log::info('Meal type force deleted', [
            'module' => 'meal_type',
            'id' => $mealType->id,
        ]);
    }
}
