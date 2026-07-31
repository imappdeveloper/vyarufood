<?php

declare(strict_types=1);

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseOrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'purchase_order_id' => $this->purchase_order_id,
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->inventoryItem->name),
            'ordered_quantity' => $this->ordered_quantity,
            'received_quantity' => $this->received_quantity,
            'pending_quantity' => $this->pending_quantity,
            'unit_price' => $this->unit_price,
            'tax_percentage' => $this->tax_percentage,
            'discount' => $this->discount,
            'line_total' => $this->line_total,
            'unit_id' => $this->unit_id,
            'unit_name' => $this->whenLoaded('unit', fn () => $this->unit->name),
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
