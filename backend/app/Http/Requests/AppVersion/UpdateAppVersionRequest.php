<?php

declare(strict_types=1);

namespace App\Http\Requests\AppVersion;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateAppVersionRequest extends BaseRequest
{
    public function rules(): array
    {
        $versionId = $this->route('uuid');

        return [
            'platform' => ['sometimes', 'string', Rule::in(['android', 'ios', 'web'])],
            'version_name' => ['sometimes', 'string', 'max:50'],
            'version_code' => ['sometimes', 'integer', 'min:1', Rule::unique('app_versions', 'version_code')->ignore($versionId, 'uuid')],
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
