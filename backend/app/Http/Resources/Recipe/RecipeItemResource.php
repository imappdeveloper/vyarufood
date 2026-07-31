<?php

declare(strict_types=1);

namespace App\Http\Resources\Recipe;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'recipe_id' => $this->recipe_id,
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->inventoryItem->name),
            'unit_id' => $this->unit_id,
            'unit_name' => $this->whenLoaded('unit', fn () => $this->unit->name),
            'required_quantity' => $this->required_quantity,
            'wastage_percentage' => $this->wastage_percentage,
            'actual_quantity' => $this->actual_quantity,
            'cost' => $this->cost,
            'display_order' => $this->display_order,
            'remarks' => $this->remarks,
        ];
    }
}
