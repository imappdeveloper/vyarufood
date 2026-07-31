<?php

declare(strict_types=1);

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'item_code' => $this->item_code,
            'item_name' => $this->item_name,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'hsn_code' => $this->hsn_code,
            'description' => $this->description,
            'category_name' => $this->category_name,
            'unit_id' => $this->unit_id,
            'unit_name' => $this->whenLoaded('unit', fn () => $this->unit->name ?? null),
            'current_stock' => (float) $this->current_stock,
            'reserved_stock' => (float) $this->reserved_stock,
            'available_stock' => (float) $this->available_stock,
            'minimum_stock' => (float) $this->minimum_stock,
            'maximum_stock' => (float) ($this->maximum_stock ?? 0),
            'reorder_level' => (float) $this->reorder_level,
            'reorder_quantity' => (float) $this->reorder_quantity,
            'cost_price' => (float) $this->cost_price,
            'average_cost' => (float) $this->average_cost,
            'last_purchase_cost' => (float) ($this->last_purchase_cost ?? 0),
            'stock_valuation_method' => $this->stock_valuation_method,
            'expiry_tracking' => $this->expiry_tracking,
            'batch_tracking' => $this->batch_tracking,
            'serial_tracking' => $this->serial_tracking,
            'storage_location' => $this->storage_location,
            'shelf_number' => $this->shelf_number,
            'rack_number' => $this->rack_number,
            'bin_number' => $this->bin_number,
            'remarks' => $this->remarks,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
