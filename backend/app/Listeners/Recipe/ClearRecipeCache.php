<?php

declare(strict_types=1);

namespace App\Listeners\Recipe;

use App\Events\Recipe\{RecipeCreated, RecipeUpdated, RecipeDeleted, RecipeRestored, InventoryConsumed, FoodCostUpdated};
use App\Support\CacheManager;

class ClearRecipeCache
{
    public function handle(mixed $event): void
    {
        CacheManager::flush('recipe');
    }
}
