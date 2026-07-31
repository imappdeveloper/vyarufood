<?php

declare(strict_types=1);

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class StoreBankReconciliationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bank_account_id' => 'required|integer|exists:bank_accounts,id',
            'reconciliation_date' => 'required|date',
            'statement_date' => 'required|date',
            'opening_balance' => 'required|numeric',
            'closing_balance' => 'required|numeric',
            'total_deposits' => 'required|numeric|min:0',
            'total_withdrawals' => 'required|numeric|min:0',
            'adjusted_balance' => 'required|numeric',
            'difference' => 'required|numeric',
            'remarks' => 'nullable|string',
        ];
    }
}
