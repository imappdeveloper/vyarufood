<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerLoginRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
            'remember_me' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'Email or Phone',
            'password' => 'Password',
            'remember_me' => 'Remember Me',
        ];
    }
}
