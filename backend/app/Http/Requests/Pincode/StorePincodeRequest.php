<?php

declare(strict_types=1);

namespace App\Http\Requests\Pincode;

use App\Support\BaseRequest;

class StorePincodeRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'delivery_zone_id' => ['required', 'integer', 'exists:delivery_zones,id'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'state_id' => ['required', 'integer', 'exists:states,id'],
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'pincode' => ['required', 'string', 'max:10', 'unique:pincodes,pincode'],
            'office_name' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'is_serviceable' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'delivery_zone_id' => 'Delivery Zone',
            'country_id' => 'Country',
            'state_id' => 'State',
            'city_id' => 'City',
            'area_id' => 'Area',
            'pincode' => 'Pincode',
            'office_name' => 'Office Name',
            'district' => 'District',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
            'status' => 'Status',
            'is_serviceable' => 'Serviceable',
        ];
    }
}
