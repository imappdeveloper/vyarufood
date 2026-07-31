<?php

declare(strict_types=1);

namespace App\Http\Requests\Supplier;

use App\Support\BaseRequest;

class UpdateSupplierContactRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'designation' => ['nullable', 'string', 'max:100'],
            'mobile' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:150'],
            'is_primary' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Name',
            'designation' => 'Designation',
            'mobile' => 'Mobile',
            'email' => 'Email',
            'is_primary' => 'Primary Contact',
        ];
    }
}
