<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'expense_category_id' => 'required|integer|exists:expense_categories,id',
            'expense_date' => 'required|date',
            'expense_title' => 'required|string|max:300',
            'expense_description' => 'nullable|string|max:2000',
            'vendor_name' => 'nullable|string|max:200',
            'supplier_id' => 'nullable|integer|exists:suppliers,id',
            'amount' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string|in:cash,bank_transfer,upi,credit_card,debit_card,cheque,wallet',
            'payment_account' => 'nullable|string|max:100',
            'transaction_reference' => 'nullable|string|max:100',
            'invoice_number' => 'nullable|string|max:100',
            'invoice_date' => 'nullable|date',
            'bill_attachment' => 'nullable|string|max:500',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|string|in:weekly,biweekly,monthly,quarterly,yearly',
            'next_due_date' => 'nullable|date|after_or_equal:today',
            'expense_status' => 'string|in:draft,pending_approval',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
