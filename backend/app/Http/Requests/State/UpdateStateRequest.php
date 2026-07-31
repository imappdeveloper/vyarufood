<?php

declare(strict_types=1);

namespace App\Http\Requests\State;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateStateRequest extends BaseRequest
{
    public function rules(): array
    {
        $stateId = $this->route('state')?->id;

        return [
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'name' => ['nullable', 'string', 'max:255', Rule::unique('states', 'name')->where(fn ($q) => $q->where('country_id', $this->input('country_id', $this->route('state')?->country_id)))->ignore($stateId)],
            'state_code' => ['nullable', 'string', 'max:10', Rule::unique('states', 'state_code')->where(fn ($q) => $q->where('country_id', $this->input('country_id', $this->route('state')?->country_id)))->ignore($stateId)],
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
