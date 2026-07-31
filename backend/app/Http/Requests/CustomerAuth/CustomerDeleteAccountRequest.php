<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerDeleteAccountRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'password' => ['required', 'string'],
            'reason' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }

    public function attributes(): array
    {
        return [
            'password' => 'Password',
            'reason' => 'Reason',
        ];
    }
}
