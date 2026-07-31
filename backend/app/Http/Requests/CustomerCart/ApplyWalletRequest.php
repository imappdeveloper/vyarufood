<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerCart;

use Illuminate\Foundation\Http\FormRequest;

class ApplyWalletRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'nullable|numeric|min:0',
        ];
    }
}
