<?php

declare(strict_types=1);

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChartOfAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'account_code' => 'required|string|max:20|unique:chart_of_accounts,account_code,' . $this->route('chart_of_account')?->id ?? '',
            'account_name' => 'required|string|max:200',
            'account_type' => 'required|in:asset,liability,equity,income,expense',
            'parent_account_id' => 'nullable|integer|exists:chart_of_accounts,id',
            'opening_balance' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'status' => 'required|in:active,inactive',
        ];
    }
}
