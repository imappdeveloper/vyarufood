<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerRegisterRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:customers,email'],
            'phone' => ['required', 'string', 'max:20', 'unique:customers,phone'],
            'country_code' => ['nullable', 'string', 'max:10'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
            'referral_code' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'email' => 'Email',
            'phone' => 'Phone Number',
            'country_code' => 'Country Code',
            'password' => 'Password',
            'password_confirmation' => 'Confirm Password',
            'referral_code' => 'Referral Code',
        ];
    }
}
