<?php
declare(strict_types=1);

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_code' => 'required|string|max:50|unique:inventory_items,item_code',
            'item_name' => 'required|string|max:150',
            'category_name' => 'nullable|string|max:100',
            'unit_id' => 'required|exists:units,id',
            'sku' => 'nullable|string|max:100|unique:inventory_items,sku',
            'barcode' => 'nullable|string|max:100|unique:inventory_items,barcode',
            'hsn_code' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:2000',
            'opening_stock' => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|numeric|min:0',
            'minimum_stock' => 'nullable|numeric|min:0',
            'maximum_stock' => 'nullable|numeric|min:0',
            'reorder_level' => 'nullable|numeric|min:0',
            'reorder_quantity' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_valuation_method' => 'nullable|string|in:fifo,weighted_average,standard_cost',
            'expiry_tracking' => 'nullable|boolean',
            'batch_tracking' => 'nullable|boolean',
            'serial_tracking' => 'nullable|boolean',
            'storage_location' => 'nullable|string|max:100',
            'shelf_number' => 'nullable|string|max:20',
            'rack_number' => 'nullable|string|max:20',
            'bin_number' => 'nullable|string|max:20',
            'status' => 'nullable|string|in:active,inactive',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
