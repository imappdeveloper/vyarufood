<?php

declare(strict_types=1);

namespace App\Http\Requests\SystemSetting;

use App\Support\BaseRequest;

class BulkUpdateSystemSettingRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'settings' => ['required', 'array', 'min:1'],
            'settings.*.setting_key' => ['required', 'string', 'max:150', 'exists:system_settings,setting_key'],
            'settings.*.setting_value' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'settings' => 'settings',
        ];
    }
}
