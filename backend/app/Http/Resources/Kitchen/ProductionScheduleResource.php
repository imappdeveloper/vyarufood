<?php

declare(strict_types=1);

namespace App\Http\Resources\Kitchen;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'kitchen_id' => $this->kitchen_id,
            'production_date' => $this->production_date?->format('Y-m-d'),
            'meal_type' => $this->meal_type,
            'meal_type_label' => $this->meal_type_label,
            'planned_quantity' => $this->planned_quantity,
            'produced_quantity' => $this->produced_quantity,
            'remaining_quantity' => $this->remaining_quantity,
            'completion_percentage' => $this->completion_percentage,
            'production_start' => $this->production_start?->toISOString(),
            'production_end' => $this->production_end?->toISOString(),
            'status' => $this->status,
            'status_label' => $this->status_label,
            'is_overdue' => $this->is_overdue,
            'remarks' => $this->remarks,
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
