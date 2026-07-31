<?php

declare(strict_types=1);

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'order_id' => $this->order_id,
            'meal_id' => $this->meal_id,
            'meal_name' => $this->meal_name,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'meal_type_name' => $this->whenLoaded('mealType', fn () => $this->mealType->name),
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'tax' => $this->tax,
            'discount' => $this->discount,
            'total' => $this->total,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
