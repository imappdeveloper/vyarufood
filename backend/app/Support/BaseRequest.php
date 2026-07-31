<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Foundation\Http\FormRequest;

abstract class BaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute is required.',
            'string' => ':attribute must be a string.',
            'email' => ':attribute must be a valid email address.',
            'numeric' => ':attribute must be a number.',
            'integer' => ':attribute must be an integer.',
            'boolean' => ':attribute must be true or false.',
            'date' => ':attribute must be a valid date.',
            'in' => ':attribute must be one of: :values.',
            'array' => ':attribute must be an array.',
            'url' => ':attribute must be a valid URL.',
            'unique' => ':attribute has already been taken.',
            'exists' => 'The selected :attribute is invalid.',
        ];
    }
}
