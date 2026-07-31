<?php

declare(strict_types=1);

namespace App\Http\Requests\Supplier;

use App\Support\BaseRequest;

class BlacklistSupplierRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'reason' => 'Reason',
        ];
    }
}
