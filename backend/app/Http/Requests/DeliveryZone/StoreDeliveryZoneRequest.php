<?php

declare(strict_types=1);

namespace App\Http\Requests\DeliveryZone;

use App\Support\BaseRequest;

class StoreDeliveryZoneRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'state_id' => ['required', 'integer', 'exists:states,id'],
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'zone_name' => ['required', 'string', 'max:255'],
            'zone_code' => ['required', 'string', 'max:50', 'unique:delivery_zones,zone_code'],
            'description' => ['nullable', 'string', 'max:1000'],
            'delivery_radius' => ['nullable', 'numeric', 'min:0'],
            'minimum_order_amount' => ['nullable', 'numeric', 'min:0'],
            'delivery_charge' => ['nullable', 'numeric', 'min:0'],
            'free_delivery_above' => ['nullable', 'numeric', 'min:0'],
            'estimated_delivery_time' => ['nullable', 'integer', 'min:1'],
            'maximum_orders_per_slot' => ['nullable', 'integer', 'min:1'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'is_default' => ['nullable', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'country_id' => 'Country',
            'state_id' => 'State',
            'city_id' => 'City',
            'area_id' => 'Area',
            'zone_name' => 'Zone Name',
            'zone_code' => 'Zone Code',
            'description' => 'Description',
            'delivery_radius' => 'Delivery Radius',
            'minimum_order_amount' => 'Minimum Order Amount',
            'delivery_charge' => 'Delivery Charge',
            'free_delivery_above' => 'Free Delivery Above',
            'estimated_delivery_time' => 'Estimated Delivery Time',
            'maximum_orders_per_slot' => 'Maximum Orders Per Slot',
            'priority' => 'Priority',
            'status' => 'Status',
            'is_default' => 'Default',
            'remarks' => 'Remarks',
        ];
    }
}
