<?php

declare(strict_types=1);

namespace App\Http\Requests\State;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class StoreStateRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'name' => ['required', 'string', 'max:255', Rule::unique('states', 'name')->where(fn ($q) => $q->where('country_id', $this->input('country_id')))],
            'state_code' => ['nullable', 'string', 'max:10', Rule::unique('states', 'state_code')->where(fn ($q) => $q->where('country_id', $this->input('country_id')))],
            'abbreviation' => ['nullable', 'string', 'max:10'],
            'gst_code' => ['nullable', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['nullable', 'string', 'in:active,inactive,pending'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_default' => ['nullable', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'country_id' => 'Country',
            'name' => 'State Name',
            'state_code' => 'State Code',
            'abbreviation' => 'Abbreviation',
            'gst_code' => 'GST Code',
        ];
    }
}
