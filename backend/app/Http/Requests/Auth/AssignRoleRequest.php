<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Support\BaseRequest;

class AssignRoleRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }
}
