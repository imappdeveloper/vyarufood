<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerAddress;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerAddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'address_type' => $this->address_type,
            'address_type_label' => $this->address_label,
            'house_no' => $this->house_no,
            'building_name' => $this->building_name,
            'floor' => $this->floor,
            'street' => $this->street,
            'landmark' => $this->landmark,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'full_address' => $this->full_address,
            'country_id' => $this->country_id,
            'state_id' => $this->state_id,
            'city_id' => $this->city_id,
            'area_id' => $this->area_id,
            'pincode_id' => $this->pincode_id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'google_place_id' => $this->google_place_id,
            'contact_person' => $this->contact_person,
            'contact_mobile' => $this->contact_mobile,
            'delivery_instruction' => $this->delivery_instruction,
            'is_default' => $this->is_default,
            'is_verified' => $this->is_verified,
            'status' => $this->status?->value,
            'status_label' => $this->status?->value ? ucfirst($this->status->value) : 'Unknown',
            'country' => $this->whenLoaded('country', fn () => [
                'id' => $this->country->id,
                'name' => $this->country->name,
            ]),
            'state' => $this->whenLoaded('state', fn () => [
                'id' => $this->state->id,
                'name' => $this->state->name,
            ]),
            'city' => $this->whenLoaded('city', fn () => [
                'id' => $this->city->id,
                'name' => $this->city->name,
            ]),
            'area' => $this->whenLoaded('area', fn () => [
                'id' => $this->area->id,
                'name' => $this->area->name,
            ]),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'uuid' => $this->customer->uuid,
                'full_name' => $this->customer->full_name,
                'email' => $this->customer->email,
                'phone' => $this->customer->phone,
            ]),
            'pincode' => $this->whenLoaded('pincode', fn () => [
                'id' => $this->pincode->id,
                'pincode' => $this->pincode->pincode,
            ]),
            'delivery_zone' => $this->whenLoaded('deliveryZone', fn () => [
                'id' => $this->deliveryZone->id,
                'uuid' => $this->deliveryZone->uuid,
                'zone_name' => $this->deliveryZone->zone_name,
                'zone_code' => $this->deliveryZone->zone_code,
                'delivery_charge' => (float) ($this->deliveryZone->delivery_charge ?? 0),
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
