<?php

declare(strict_types=1);

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class StoreBankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'account_name' => 'required|string|max:200',
            'bank_name' => 'required|string|max:200',
            'account_number' => 'required|string|max:50',
            'ifsc_code' => 'nullable|string|max:20',
            'branch' => 'nullable|string|max:200',
            'account_type' => 'required|in:savings,current,loan',
            'chart_of_account_id' => 'nullable|integer|exists:chart_of_accounts,id',
            'opening_balance' => 'required|numeric|min:0',
            'is_default' => 'boolean',
            'status' => 'required|in:active,inactive',
        ];
    }
}
