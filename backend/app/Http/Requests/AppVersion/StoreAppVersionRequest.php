<?php

declare(strict_types=1);

namespace App\Http\Requests\AppVersion;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class StoreAppVersionRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', Rule::in(['android', 'ios', 'web'])],
            'version_name' => ['required', 'string', 'max:50'],
            'version_code' => ['required', 'integer', 'min:1', Rule::unique('app_versions', 'version_code')],
            'minimum_supported_version' => ['nullable', 'string', 'max:50'],
            'force_update' => ['sometimes', 'boolean'],
            'release_notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', Rule::in(['active', 'inactive', 'deprecated'])],
        ];
    }

    public function attributes(): array
    {
        return [
            'platform' => 'platform',
            'version_name' => 'version name',
            'version_code' => 'version code',
            'minimum_supported_version' => 'minimum supported version',
            'force_update' => 'force update',
            'release_notes' => 'release notes',
        ];
    }
}
