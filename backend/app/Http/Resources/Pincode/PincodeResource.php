<?php

declare(strict_types=1);

namespace App\Http\Resources\Pincode;

use App\Support\BaseResource;

class PincodeResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'pincode' => $this->pincode,
            'office_name' => $this->office_name,
            'district' => $this->district,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => is_object($this->status) ? $this->status->value : $this->status,
            'status_label' => is_object($this->status) ? $this->status->label() : ucfirst($this->status),
            'is_serviceable' => $this->is_serviceable,
            'deliveryZone' => new \App\Http\Resources\DeliveryZone\DeliveryZoneResource($this->whenLoaded('deliveryZone')),
            'country' => new \App\Http\Resources\Country\CountryResource($this->whenLoaded('country')),
            'state' => new \App\Http\Resources\State\StateResource($this->whenLoaded('state')),
            'city' => new \App\Http\Resources\City\CityResource($this->whenLoaded('city')),
            'area' => new \App\Http\Resources\Area\AreaResource($this->whenLoaded('area')),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}