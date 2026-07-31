<?php

declare(strict_types=1);

namespace App\Http\Resources\Kitchen;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KitchenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'kitchen_code' => $this->kitchen_code,
            'name' => $this->name,
            'description' => $this->description,
            'kitchen_type' => $this->kitchen_type,
            'kitchen_type_label' => $this->kitchen_type_label,
            'manager_name' => $this->manager_name,
            'manager_mobile' => $this->manager_mobile,
            'manager_email' => $this->manager_email,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'landmark' => $this->landmark,
            'full_address' => $this->full_address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'opening_time' => $this->opening_time,
            'closing_time' => $this->closing_time,
            'preparation_start_time' => $this->preparation_start_time,
            'accept_order_start_time' => $this->accept_order_start_time,
            'accept_order_end_time' => $this->accept_order_end_time,
            'daily_capacity' => $this->daily_capacity,
            'maximum_orders' => $this->maximum_orders,
            'emergency_contact' => $this->emergency_contact,
            'license_number' => $this->license_number,
            'fssai_number' => $this->fssai_number,
            'gst_number' => $this->gst_number,
            'logo' => $this->logo,
            'status' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->value : $this->status,
            'status_label' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->label() : ucfirst($this->status ?? ''),
            'is_default' => $this->is_default,
            'remarks' => $this->remarks,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'country' => $this->whenLoaded('country', fn () => [
                'id' => $this->country->id,
                'uuid' => $this->country->uuid,
                'name' => $this->country->name,
            ]),
            'state' => $this->whenLoaded('state', fn () => [
                'id' => $this->state->id,
                'uuid' => $this->state->uuid,
                'name' => $this->state->name,
            ]),
            'city' => $this->whenLoaded('city', fn () => [
                'id' => $this->city->id,
                'uuid' => $this->city->uuid,
                'name' => $this->city->name,
            ]),
            'area' => $this->whenLoaded('area', fn () => [
                'id' => $this->area->id,
                'uuid' => $this->area->uuid,
                'name' => $this->area->name,
            ]),
            'delivery_zone' => $this->whenLoaded('deliveryZone', fn () => [
                'id' => $this->deliveryZone->id,
                'uuid' => $this->deliveryZone->uuid,
                'zone_name' => $this->deliveryZone->zone_name,
                'zone_code' => $this->deliveryZone->zone_code,
            ]),
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
        ];
    }
}
