<?php

declare(strict_types=1);

namespace App\Http\Requests\Country;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateCountryRequest extends BaseRequest
{
    public function rules(): array
    {
        $countryId = $this->route('country')?->id;

        return [
            'iso2' => ['nullable', 'string', 'max:2', 'alpha', Rule::unique('countries', 'iso2')->ignore($countryId)],
            'iso3' => ['nullable', 'string', 'max:3', 'alpha', Rule::unique('countries', 'iso3')->ignore($countryId)],
            'name' => ['nullable', 'string', 'max:255', Rule::unique('countries', 'name')->ignore($countryId)],
            'numeric_code' => ['nullable', 'string', 'max:10'],
            'phone_code' => ['nullable', 'string', 'max:10'],
            'native_name' => ['nullable', 'string', 'max:255'],
            'capital' => ['nullable', 'string', 'max:255'],
            'currency_code' => ['nullable', 'string', 'max:10'],
            'currency_symbol' => ['nullable', 'string', 'max:10'],
            'currency_name' => ['nullable', 'string', 'max:100'],
            'emoji' => ['nullable', 'string', 'max:10'],
            'emoji_unicode' => ['nullable', 'string', 'max:50'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'region' => ['nullable', 'string', 'max:100'],
            'subregion' => ['nullable', 'string', 'max:100'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'flag_image' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'string', 'in:active,inactive,pending'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_default' => ['nullable', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'iso2' => 'ISO2',
            'iso3' => 'ISO3',
            'name' => 'Country Name',
            'phone_code' => 'Phone Code',
            'currency_code' => 'Currency Code',
        ];
    }
}
