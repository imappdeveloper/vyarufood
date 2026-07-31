<?php

declare(strict_types=1);

namespace App\Listeners\Recipe;

use Illuminate\Support\Facades\Log;

class LogRecipeActivity
{
    public function handle(mixed $event): void
    {
        $recipe = $event->recipe ?? null;
        $batch = $event->batch ?? null;
        $className = class_basename($event::class);

        Log::info("[recipe] {$className}", [
            'recipe_id' => $recipe?->id,
            'recipe_code' => $recipe?->recipe_code,
            'recipe_name' => $recipe?->recipe_name,
            'batch_id' => $batch?->id,
            'batch_number' => $batch?->batch_number,
        ]);
    }
}
