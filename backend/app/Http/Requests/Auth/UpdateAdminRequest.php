<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Support\BaseRequest;

class UpdateAdminRequest extends BaseRequest
{
    public function rules(): array
    {
        $adminId = $this->route('admin')?->id ?? $this->route('id');

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:admins,email,' . $adminId],
            'mobile' => ['sometimes', 'nullable', 'string', 'max:20', 'unique:admins,mobile,' . $adminId],
            'role_id' => ['sometimes', 'exists:roles,id'],
            'status' => ['sometimes', 'string', 'in:active,inactive,pending,suspended'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'role_id' => 'Role',
            'status' => 'Status',
        ];
    }
}
