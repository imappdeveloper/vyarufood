<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Support\BaseRequest;

class StoreAdminRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:admins,email'],
            'mobile' => ['nullable', 'string', 'max:20', 'unique:admins,mobile'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
            'role_id' => ['required', 'exists:roles,id'],
            'status' => ['sometimes', 'string', 'in:active,inactive,pending'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'password' => 'Password',
            'role_id' => 'Role',
            'status' => 'Status',
        ];
    }
}
