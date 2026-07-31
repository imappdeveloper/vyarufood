<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\CustomerMealSelection;
use Illuminate\Support\Facades\Log;

class CustomerMealSelectionObserver
{
    public function created(CustomerMealSelection $selection): void
    {
        Log::info('[CustomerMealSelection] Created: ' . $selection->id, [
            'module' => 'customer_meal_selection',
            'data' => $selection->toArray(),
        ]);
    }

    public function updated(CustomerMealSelection $selection): void
    {
        Log::info('[CustomerMealSelection] Updated: ' . $selection->id, [
            'module' => 'customer_meal_selection',
            'data' => $selection->toArray(),
        ]);
    }

    public function deleted(CustomerMealSelection $selection): void
    {
        Log::info('[CustomerMealSelection] Deleted: ' . $selection->id, [
            'module' => 'customer_meal_selection',
            'id' => $selection->id,
        ]);
    }

    public function restored(CustomerMealSelection $selection): void
    {
        Log::info('[CustomerMealSelection] Restored: ' . $selection->id, [
            'module' => 'customer_meal_selection',
            'id' => $selection->id,
        ]);
    }

    public function forceDeleted(CustomerMealSelection $selection): void
    {
        Log::info('[CustomerMealSelection] Force Deleted: ' . $selection->id, [
            'module' => 'customer_meal_selection',
            'id' => $selection->id,
        ]);
    }
}
