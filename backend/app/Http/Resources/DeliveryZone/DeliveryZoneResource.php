<?php

declare(strict_types=1);

namespace App\Http\Resources\DeliveryZone;

use App\Support\BaseResource;

class DeliveryZoneResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'country_id' => $this->country_id,
            'state_id' => $this->state_id,
            'city_id' => $this->city_id,
            'area_id' => $this->area_id,
            'zone_name' => $this->zone_name,
            'zone_code' => $this->zone_code,
            'description' => $this->description,
            'delivery_radius' => $this->delivery_radius,
            'minimum_order_amount' => $this->minimum_order_amount,
            'delivery_charge' => $this->delivery_charge,
            'free_delivery_above' => $this->free_delivery_above,
            'estimated_delivery_time' => $this->estimated_delivery_time,
            'maximum_orders_per_slot' => $this->maximum_orders_per_slot,
            'priority' => $this->priority,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status),
            'is_default' => $this->is_default,
            'remarks' => $this->remarks,
            'country' => new \App\Http\Resources\Country\CountryResource($this->whenLoaded('country')),
            'state' => new \App\Http\Resources\State\StateResource($this->whenLoaded('state')),
            'city' => new \App\Http\Resources\City\CityResource($this->whenLoaded('city')),
            'area' => new \App\Http\Resources\Area\AreaResource($this->whenLoaded('area')),
            'pincodesCount' => $this->whenCounted('pincodes'),
            'deliverySlotsCount' => $this->whenCounted('deliverySlots'),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}