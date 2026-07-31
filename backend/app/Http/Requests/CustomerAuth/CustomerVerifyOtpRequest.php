<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerVerifyOtpRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'otp' => ['required', 'string', 'size:6'],
        ];
    }

    public function attributes(): array
    {
        return [
            'otp' => 'OTP',
        ];
    }
}
