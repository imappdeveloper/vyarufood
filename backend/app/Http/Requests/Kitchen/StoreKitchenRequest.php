<?php

declare(strict_types=1);

namespace App\Http\Requests\Kitchen;

use App\Support\BaseRequest;

class StoreKitchenRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'kitchen_code' => ['required', 'string', 'max:50', 'unique:kitchens,kitchen_code'],
            'name' => ['required', 'string', 'max:255', 'unique:kitchens,name'],
            'description' => ['nullable', 'string', 'max:1000'],
            'kitchen_type' => ['required', 'string', 'in:main_kitchen,central_kitchen,cloud_kitchen,branch_kitchen,future_kitchen'],
            'manager_name' => ['nullable', 'string', 'max:100'],
            'manager_mobile' => ['nullable', 'string', 'max:20'],
            'manager_email' => ['nullable', 'email', 'max:255'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'delivery_zone_id' => ['nullable', 'integer', 'exists:delivery_zones,id'],
            'address_line_1' => ['nullable', 'string', 'max:1000'],
            'address_line_2' => ['nullable', 'string', 'max:1000'],
            'landmark' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'opening_time' => ['nullable', 'date_format:H:i'],
            'closing_time' => ['nullable', 'date_format:H:i'],
            'preparation_start_time' => ['nullable', 'date_format:H:i'],
            'accept_order_start_time' => ['nullable', 'date_format:H:i'],
            'accept_order_end_time' => ['nullable', 'date_format:H:i'],
            'daily_capacity' => ['nullable', 'integer', 'min:0'],
            'maximum_orders' => ['nullable', 'integer', 'min:0'],
            'emergency_contact' => ['nullable', 'string', 'max:20'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'fssai_number' => ['nullable', 'string', 'max:50'],
            'gst_number' => ['nullable', 'string', 'max:20'],
            'logo' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'is_default' => ['sometimes', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'kitchen_code' => 'Kitchen Code',
            'name' => 'Kitchen Name',
            'description' => 'Description',
            'kitchen_type' => 'Kitchen Type',
            'manager_name' => 'Manager Name',
            'manager_mobile' => 'Manager Mobile',
            'manager_email' => 'Manager Email',
            'country_id' => 'Country',
            'state_id' => 'State',
            'city_id' => 'City',
            'area_id' => 'Area',
            'delivery_zone_id' => 'Delivery Zone',
            'address_line_1' => 'Address Line 1',
            'address_line_2' => 'Address Line 2',
            'landmark' => 'Landmark',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
            'opening_time' => 'Opening Time',
            'closing_time' => 'Closing Time',
            'preparation_start_time' => 'Preparation Start Time',
            'accept_order_start_time' => 'Accept Order Start Time',
            'accept_order_end_time' => 'Accept Order End Time',
            'daily_capacity' => 'Daily Capacity',
            'maximum_orders' => 'Maximum Orders',
            'emergency_contact' => 'Emergency Contact',
            'license_number' => 'License Number',
            'fssai_number' => 'FSSAI Number',
            'gst_number' => 'GST Number',
            'logo' => 'Logo',
            'status' => 'Status',
            'is_default' => 'Default Kitchen',
            'remarks' => 'Remarks',
        ];
    }
}
