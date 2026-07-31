<?php

declare(strict_types=1);

namespace App\Http\Resources\Recipe;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'recipe_code' => $this->recipe_code,
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'recipe_name' => $this->recipe_name,
            'version' => $this->version,
            'yield_quantity' => $this->yield_quantity,
            'yield_unit' => $this->yield_unit,
            'preparation_time' => $this->preparation_time,
            'cooking_time' => $this->cooking_time,
            'serving_size' => $this->serving_size,
            'recipe_cost' => $this->recipe_cost,
            'food_cost_percentage' => $this->food_cost_percentage,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'items' => RecipeItemResource::collection($this->whenLoaded('items')),
            'items_count' => $this->whenCounted('items'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
