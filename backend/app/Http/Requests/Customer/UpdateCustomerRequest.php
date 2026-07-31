<?php

declare(strict_types=1);

namespace App\Http\Requests\Customer;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends BaseRequest
{
    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customerId)],
            'phone' => ['sometimes', 'string', 'max:20', Rule::unique('customers', 'phone')->ignore($customerId)],
            'country_code' => ['nullable', 'string', 'max:10'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'profile_photo' => ['nullable', 'string', 'max:500'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address_line_1' => ['nullable', 'string', 'max:500'],
            'address_line_2' => ['nullable', 'string', 'max:500'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'state_id' => ['nullable', 'integer', 'exists:states,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'pincode' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['sometimes', 'string', 'in:active,inactive,suspended'],
            'email_verified' => ['nullable', 'boolean'],
            'phone_verified' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'email' => 'Email',
            'phone' => 'Phone',
            'country_code' => 'Country Code',
            'password' => 'Password',
            'profile_photo' => 'Profile Photo',
            'gender' => 'Gender',
            'date_of_birth' => 'Date of Birth',
            'address_line_1' => 'Address Line 1',
            'address_line_2' => 'Address Line 2',
            'country_id' => 'Country',
            'state_id' => 'State',
            'city_id' => 'City',
            'area_id' => 'Area',
            'pincode' => 'Pincode',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
            'status' => 'Status',
            'email_verified' => 'Email Verified',
            'phone_verified' => 'Phone Verified',
        ];
    }
}
