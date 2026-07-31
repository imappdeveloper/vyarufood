<?php

declare(strict_types=1);

namespace App\Events\Recipe;

use App\Models\Recipe;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RecipeDeleted
{
    use Dispatchable, SerializesModels;

    public function __construct(public Recipe $recipe) {}
}
