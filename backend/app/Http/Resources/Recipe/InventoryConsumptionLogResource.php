<?php

declare(strict_types=1);

namespace App\Http\Resources\Recipe;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryConsumptionLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'production_batch_id' => $this->production_batch_id,
            'recipe_id' => $this->recipe_id,
            'recipe_name' => $this->whenLoaded('recipe', fn () => $this->recipe->recipe_name),
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->inventoryItem->name),
            'consumed_quantity' => $this->consumed_quantity,
            'unit_cost' => $this->unit_cost,
            'total_cost' => $this->total_cost,
            'consumption_date' => $this->consumption_date?->toDateString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
