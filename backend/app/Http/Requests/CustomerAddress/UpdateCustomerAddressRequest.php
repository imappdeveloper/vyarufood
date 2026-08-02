<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAddress;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_type' => 'sometimes|string|in:home,office,hostel,apartment,pg,other',
            'house_no' => 'nullable|string|max:50',
            'building_name' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:20',
            'street' => 'nullable|string|max:200',
            'landmark' => 'nullable|string|max:200',
            'address_line_1' => 'sometimes|string|max:300',
            'address_line_2' => 'nullable|string|max:300',
            'country_id' => 'sometimes|integer|exists:countries,id',
            'state_id' => 'sometimes|integer|exists:states,id',
            'city_id' => 'sometimes|integer|exists:cities,id',
            'area_id' => 'nullable|integer|exists:areas,id',
            'pincode' => 'nullable|string|max:10',
            'pincode_id' => 'nullable|integer|exists:pincodes,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'delivery_zone_id' => 'nullable|integer|exists:delivery_zones,id',
            'google_place_id' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:100',
            'contact_mobile' => 'nullable|string|max:20',
            'delivery_instruction' => 'nullable|string|max:500',
            'is_default' => 'boolean',
        ];
    }
}
