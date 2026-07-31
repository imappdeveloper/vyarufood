<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Support\BaseRequest;

class StoreRoleRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
            'display_name' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:500'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }
}
