<?php

declare(strict_types=1);

namespace App\Http\Requests\Supplier;

use App\Support\BaseRequest;

class UpdateSupplierProductRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'inventory_item_id' => ['required', 'integer', 'exists:inventory_items,id'],
            'supplier_product_code' => ['nullable', 'string', 'max:50'],
            'supplier_product_name' => ['nullable', 'string', 'max:200'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'minimum_order_quantity' => ['nullable', 'numeric', 'min:0'],
            'maximum_order_quantity' => ['nullable', 'numeric', 'min:0'],
            'lead_time_days' => ['nullable', 'integer', 'min:0'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'is_primary_supplier' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'inventory_item_id' => 'Inventory Item',
            'supplier_product_code' => 'Supplier Product Code',
            'supplier_product_name' => 'Supplier Product Name',
            'purchase_price' => 'Purchase Price',
            'minimum_order_quantity' => 'Minimum Order Quantity',
            'maximum_order_quantity' => 'Maximum Order Quantity',
            'lead_time_days' => 'Lead Time Days',
            'unit_id' => 'Unit',
            'is_primary_supplier' => 'Primary Supplier',
            'status' => 'Status',
        ];
    }
}
