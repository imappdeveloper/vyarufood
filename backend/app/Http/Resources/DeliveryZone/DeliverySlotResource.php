<?php

declare(strict_types=1);

namespace App\Http\Resources\DeliveryZone;

use App\Support\BaseResource;

class DeliverySlotResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slot_name' => $this->slot_name,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'maximum_orders' => $this->maximum_orders,
            'cutoff_time' => $this->cutoff_time,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst((string) ($this->status ?? '')),
            'deliveryZone' => new DeliveryZoneResource($this->whenLoaded('deliveryZone')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}