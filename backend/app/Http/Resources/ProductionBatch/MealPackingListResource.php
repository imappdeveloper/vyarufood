<?php

declare(strict_types=1);

namespace App\Http\Resources\ProductionBatch;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealPackingListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'production_batch_id' => $this->production_batch_id,
            'order_id' => $this->order_id,
            'order_number' => $this->whenLoaded('order', fn () => $this->order->order_number),
            'customer_id' => $this->customer_id,
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer->name),
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'quantity' => $this->quantity,
            'packing_status' => $this->packing_status,
            'packed_at' => $this->packed_at?->toISOString(),
            'packed_by' => $this->packed_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
