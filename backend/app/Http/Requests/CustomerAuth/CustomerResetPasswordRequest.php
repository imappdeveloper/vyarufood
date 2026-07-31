<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerResetPasswordRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'token' => 'Token',
            'email' => 'Email',
            'password' => 'Password',
            'password_confirmation' => 'Confirm Password',
        ];
    }
}
