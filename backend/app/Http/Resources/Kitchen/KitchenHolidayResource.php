<?php

declare(strict_types=1);

namespace App\Http\Resources\Kitchen;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KitchenHolidayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'kitchen_id' => $this->kitchen_id,
            'holiday_name' => $this->holiday_name,
            'holiday_type' => $this->holiday_type,
            'holiday_type_label' => $this->holiday_type_label,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'duration' => $this->duration,
            'reason' => $this->reason,
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
