<?php

declare(strict_types=1);

namespace App\Http\Resources\City;

use App\Support\BaseResource;

class CityResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'country_id' => $this->country_id,
            'state_id' => $this->state_id,
            'country' => new \App\Http\Resources\Country\CountryResource($this->whenLoaded('country')),
            'state' => new \App\Http\Resources\State\StateResource($this->whenLoaded('state')),
            'name' => $this->name,
            'city_code' => $this->city_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'timezone' => $this->timezone,
            'population' => $this->population,
            'pincode' => $this->pincode,
            'area' => $this->area,
            'sort_order' => $this->display_order,
            'is_metro' => $this->is_metro,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status),
            'is_default' => $this->is_default,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
