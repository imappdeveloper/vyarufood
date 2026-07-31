<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAddress;

use App\Support\BaseRequest;

class CheckServiceRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'pincode_id' => ['nullable', 'integer', 'exists:pincodes,id'],
            'delivery_zone_id' => ['nullable', 'integer', 'exists:delivery_zones,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function attributes(): array
    {
        return [
            'pincode_id' => 'Pincode',
            'delivery_zone_id' => 'Delivery Zone',
            'city_id' => 'City',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
        ];
    }
}
