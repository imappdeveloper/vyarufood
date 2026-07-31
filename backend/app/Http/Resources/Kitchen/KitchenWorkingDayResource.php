<?php

declare(strict_types=1);

namespace App\Http\Resources\Kitchen;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KitchenWorkingDayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'kitchen_id' => $this->kitchen_id,
            'day_of_week' => $this->day_of_week,
            'day_of_week_label' => $this->day_of_week_label,
            'is_working' => $this->is_working,
            'opening_time' => $this->opening_time,
            'closing_time' => $this->closing_time,
            'preparation_start_time' => $this->preparation_start_time,
            'accept_order_start' => $this->accept_order_start,
            'accept_order_end' => $this->accept_order_end,
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
