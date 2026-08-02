<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerGoogleLoginRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'id_token' => 'ID Token',
        ];
    }
}
