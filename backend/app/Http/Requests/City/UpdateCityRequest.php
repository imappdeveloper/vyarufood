<?php

declare(strict_types=1);

namespace App\Http\Requests\City;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateCityRequest extends BaseRequest
{
    public function rules(): array
    {
        $cityId = $this->route('city')?->id;

        return [
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'name' => ['nullable', 'string', 'max:255', Rule::unique('cities', 'name')->where(fn ($q) => $q->where('state_id', $this->input('state_id', $this->route('city')?->state_id)))->ignore($cityId)],
            'city_code' => ['nullable', 'string', 'max:20', Rule::unique('cities', 'city_code')->ignore($cityId)],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'population' => ['nullable', 'integer', 'min:0'],
            'pincode' => ['nullable', 'string', 'max:20'],
            'area' => ['nullable', 'numeric', 'min:0'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_metro' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:active,inactive,pending'],
            'is_default' => ['nullable', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'country_id' => 'Country',
            'state_id' => 'State',
            'name' => 'City Name',
            'city_code' => 'City Code',
            'timezone' => 'Timezone',
            'population' => 'Population',
            'pincode' => 'Pincode',
            'area' => 'Area',
            'display_order' => 'Display Order',
            'sort_order' => 'Sort Order',
            'is_metro' => 'Metro City',
        ];
    }
}
