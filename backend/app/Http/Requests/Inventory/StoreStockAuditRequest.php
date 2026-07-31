<?php
declare(strict_types=1);

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockAuditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'audit_date' => 'required|date',
            'physical_quantity' => 'required|numeric|min:0',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
