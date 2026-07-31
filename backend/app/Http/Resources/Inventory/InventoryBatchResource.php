<?php
declare(strict_types=1);

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryBatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->getRelation('inventoryItem')?->item_name),
            'batch_number' => $this->batch_number,
            'lot_number' => $this->lot_number,
            'manufacturing_date' => $this->manufacturing_date?->toISOString(),
            'expiry_date' => $this->expiry_date?->toISOString(),
            'received_date' => $this->received_date?->toISOString(),
            'available_quantity' => $this->available_quantity,
            'unit_cost' => $this->unit_cost,
            'total_cost' => $this->total_cost,
            'supplier_id' => $this->supplier_id,
            'supplier_company_name' => $this->whenLoaded('supplier', fn () => $this->getRelation('supplier')?->company_name),
            'purchase_order_id' => $this->purchase_order_id,
            'goods_receipt_id' => $this->goods_receipt_id,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->getRelation('createdBy')?->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
