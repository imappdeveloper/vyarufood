<?php
declare(strict_types=1);

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'adjustment_type' => 'required|string|in:addition,subtraction',
            'adjustment_quantity' => 'required|numeric|min:0.01',
            'reason' => 'required|string|max:1000',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
