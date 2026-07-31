<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerGuestVerifyOtpRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'max:20'],
            'otp' => ['required', 'string', 'size:6'],
            'first_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'phone' => 'Phone Number',
            'otp' => 'OTP',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'email' => 'Email',
        ];
    }
}
