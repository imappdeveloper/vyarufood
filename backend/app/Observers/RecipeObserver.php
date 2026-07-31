<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Recipe;
use App\Events\Recipe\{RecipeCreated, RecipeUpdated, RecipeDeleted, RecipeRestored};

class RecipeObserver
{
    public function created(Recipe $recipe): void
    {
        RecipeCreated::dispatch($recipe);
    }

    public function updated(Recipe $recipe): void
    {
        RecipeUpdated::dispatch($recipe);
    }

    public function deleted(Recipe $recipe): void
    {
        RecipeDeleted::dispatch($recipe);
    }

    public function restored(Recipe $recipe): void
    {
        RecipeRestored::dispatch($recipe);
    }
}
