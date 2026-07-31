<?php

declare(strict_types=1);

namespace App\Http\Resources\Kitchen;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KitchenCapacityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'kitchen_id' => $this->kitchen_id,
            'capacity_date' => $this->capacity_date?->format('Y-m-d'),
            'breakfast_capacity' => $this->breakfast_capacity,
            'lunch_capacity' => $this->lunch_capacity,
            'dinner_capacity' => $this->dinner_capacity,
            'healthy_meal_capacity' => $this->healthy_meal_capacity,
            'snack_capacity' => $this->snack_capacity,
            'total_meal_capacity' => $this->total_meal_capacity,
            'maximum_orders' => $this->maximum_orders,
            'reserved_orders' => $this->reserved_orders,
            'available_orders' => $this->available_orders,
            'capacity_percentage' => $this->capacity_percentage,
            'status' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->value : $this->status,
            'status_label' => $this->status_label,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'kitchen' => $this->whenLoaded('kitchen', fn () => [
                'id' => $this->kitchen->id,
                'uuid' => $this->kitchen->uuid,
                'name' => $this->kitchen->name,
                'kitchen_code' => $this->kitchen->kitchen_code,
            ]),
        ];
    }
}
