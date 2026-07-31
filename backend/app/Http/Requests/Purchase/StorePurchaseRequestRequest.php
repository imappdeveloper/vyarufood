<?php

declare(strict_types=1);

namespace App\Http\Requests\Purchase;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'request_date' => 'required|date',
            'request_type' => 'in:manual,auto_reorder,auto_forecast,auto_production',
            'requested_by' => 'nullable|string|max:150',
            'department' => 'nullable|string|max:100',
            'priority' => 'required|in:low,medium,high,urgent',
            'expected_date' => 'nullable|date|after_or_equal:today',
            'remarks' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.requested_quantity' => 'required|numeric|min:0.01',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.remarks' => 'nullable|string',
        ];
    }
}
