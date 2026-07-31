<?php

declare(strict_types=1);

namespace App\Http\Requests\Area;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateAreaRequest extends BaseRequest
{
    public function rules(): array
    {
        $areaId = $this->route('area')?->id;

        return [
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'name' => ['nullable', 'string', 'max:255', Rule::unique('areas', 'name')->where(fn ($q) => $q->where('city_id', $this->input('city_id', $this->route('area')?->city_id)))->ignore($areaId)],
            'area_code' => ['nullable', 'string', 'max:20', Rule::unique('areas', 'area_code')->ignore($areaId)],
            'postal_zone' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'delivery_radius' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'minimum_order_amount' => ['nullable', 'numeric', 'min:0'],
            'delivery_charge' => ['nullable', 'numeric', 'min:0'],
            'estimated_delivery_time' => ['nullable', 'integer', 'min:1'],
            'is_serviceable' => ['nullable', 'boolean'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_default' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:active,inactive,pending'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'country_id' => 'Country',
            'state_id' => 'State',
            'city_id' => 'City',
            'name' => 'Area Name',
            'area_code' => 'Area Code',
            'postal_zone' => 'Postal Zone',
            'delivery_radius' => 'Delivery Radius',
            'minimum_order_amount' => 'Minimum Order Amount',
            'delivery_charge' => 'Delivery Charge',
            'estimated_delivery_time' => 'Estimated Delivery Time',
            'is_serviceable' => 'Serviceable',
            'display_order' => 'Display Order',
            'sort_order' => 'Sort Order',
        ];
    }
}
