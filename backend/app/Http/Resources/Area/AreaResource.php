<?php

declare(strict_types=1);

namespace App\Http\Resources\Area;

use App\Support\BaseResource;

class AreaResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'country_id' => $this->country_id,
            'state_id' => $this->state_id,
            'city_id' => $this->city_id,
            'country' => new \App\Http\Resources\Country\CountryResource($this->whenLoaded('country')),
            'state' => new \App\Http\Resources\State\StateResource($this->whenLoaded('state')),
            'city' => new \App\Http\Resources\City\CityResource($this->whenLoaded('city')),
            'name' => $this->name,
            'area_code' => $this->area_code,
            'postal_zone' => $this->postal_zone,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'delivery_radius' => $this->delivery_radius,
            'minimum_order_amount' => $this->minimum_order_amount,
            'delivery_charge' => $this->delivery_charge,
            'estimated_delivery_time' => $this->estimated_delivery_time,
            'is_serviceable' => $this->is_serviceable,
            'is_default' => $this->is_default,
            'sort_order' => $this->display_order,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status),
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
