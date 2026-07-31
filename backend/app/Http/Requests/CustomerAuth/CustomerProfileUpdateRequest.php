<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerProfileUpdateRequest extends BaseRequest
{
    public function rules(): array
    {
        $customerId = $this->user()?->id;

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255', "unique:customers,email,{$customerId},id,deleted_at,NULL"],
            'phone' => ['sometimes', 'string', 'max:20', "unique:customers,phone,{$customerId},id,deleted_at,NULL"],
            'country_code' => ['sometimes', 'nullable', 'string', 'max:10'],
            'gender' => ['sometimes', 'nullable', 'string', 'in:male,female,other,prefer_not_to_say'],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today', 'after:1900-01-01'],
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
            'gender' => 'Gender',
            'date_of_birth' => 'Date of Birth',
        ];
    }

    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'gender.in' => 'Gender must be one of: Male, Female, Other, Prefer not to say.',
            'date_of_birth.before' => 'Date of birth must be in the past.',
            'date_of_birth.after' => 'Date of birth must be after 1900.',
        ]);
    }
}
