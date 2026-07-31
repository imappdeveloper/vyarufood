<?php

declare(strict_types=1);

namespace App\Http\Requests\SystemSetting;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateSystemSettingRequest extends BaseRequest
{
    public function rules(): array
    {
        $settingId = $this->route('uuid');

        return [
            'setting_group' => ['sometimes', 'string', 'max:100'],
            'setting_key' => ['sometimes', 'string', 'max:150', Rule::unique('system_settings', 'setting_key')->ignore($settingId, 'uuid')],
            'setting_value' => ['nullable', 'string'],
            'data_type' => ['sometimes', 'string', Rule::in(['string', 'integer', 'float', 'boolean', 'json', 'text'])],
            'is_encrypted' => ['sometimes', 'boolean'],
            'autoload' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'string', Rule::in(['active', 'inactive'])],
            'remarks' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function attributes(): array
    {
        return [
            'setting_group' => 'setting group',
            'setting_key' => 'setting key',
            'setting_value' => 'setting value',
            'data_type' => 'data type',
        ];
    }
}
