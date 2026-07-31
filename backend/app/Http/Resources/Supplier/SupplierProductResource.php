<?php

declare(strict_types=1);

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'supplier_id' => $this->supplier_id,
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->inventoryItem->name),
            'supplier_product_code' => $this->supplier_product_code,
            'supplier_product_name' => $this->supplier_product_name,
            'purchase_price' => $this->purchase_price,
            'minimum_order_quantity' => $this->minimum_order_quantity,
            'maximum_order_quantity' => $this->maximum_order_quantity,
            'lead_time_days' => $this->lead_time_days,
            'unit_id' => $this->unit_id,
            'unit_name' => $this->whenLoaded('unit', fn () => $this->unit->name),
            'is_primary_supplier' => $this->is_primary_supplier,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
