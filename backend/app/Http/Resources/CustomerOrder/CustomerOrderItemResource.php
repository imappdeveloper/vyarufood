<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerOrder;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerOrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'meal_id' => $this->meal_id,
            'meal_name' => $this->meal_name,
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'tax' => (float) $this->tax,
            'discount' => (float) $this->discount,
            'total' => (float) $this->total,
            'remarks' => $this->remarks,
            'meal' => $this->whenLoaded('meal', fn () => [
                'id' => $this->meal->id,
                'name' => $this->meal->name,
                'slug' => $this->meal->slug,
                'image_url' => $this->meal->image_url ?? null,
            ]),
        ];
    }
}
