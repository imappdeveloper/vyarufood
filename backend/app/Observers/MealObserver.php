<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Meal;

class MealObserver
{
    public function created(Meal $meal): void
    {
        \Log::info('Meal created', [
            'module' => 'meal',
            'data' => $meal->toArray(),
        ]);
    }

    public function updated(Meal $meal): void
    {
        \Log::info('Meal updated', [
            'module' => 'meal',
            'data' => $meal->toArray(),
        ]);
    }

    public function deleted(Meal $meal): void
    {
        \Log::info('Meal deleted', [
            'module' => 'meal',
            'id' => $meal->id,
        ]);
    }

    public function restoring(Meal $meal): void
    {
        \Log::info('Meal restoring', [
            'module' => 'meal',
            'id' => $meal->id,
        ]);
    }

    public function restored(Meal $meal): void
    {
        \Log::info('Meal restored', [
            'module' => 'meal',
            'id' => $meal->id,
        ]);
    }

    public function forceDeleted(Meal $meal): void
    {
        \Log::info('Meal force deleted', [
            'module' => 'meal',
            'id' => $meal->id,
        ]);
    }
}
