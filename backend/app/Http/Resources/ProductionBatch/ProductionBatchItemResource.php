<?php

declare(strict_types=1);

namespace App\Http\Resources\ProductionBatch;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionBatchItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'production_batch_id' => $this->production_batch_id,
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'meal_category_id' => $this->meal_category_id,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'meal_type_id' => $this->meal_type_id,
            'meal_type_name' => $this->whenLoaded('mealType', fn () => $this->mealType->name),
            'planned_quantity' => $this->planned_quantity,
            'prepared_quantity' => $this->prepared_quantity,
            'packed_quantity' => $this->packed_quantity,
            'wastage_quantity' => $this->wastage_quantity,
            'remaining_quantity' => $this->remaining_quantity,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
