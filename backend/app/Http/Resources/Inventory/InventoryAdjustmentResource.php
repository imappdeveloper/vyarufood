<?php
declare(strict_types=1);

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryAdjustmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->getRelation('inventoryItem')?->item_name),
            'inventory_item_code' => $this->whenLoaded('inventoryItem', fn () => $this->getRelation('inventoryItem')?->item_code),
            'adjustment_type' => $this->adjustment_type,
            'adjustment_quantity' => $this->adjustment_quantity,
            'previous_stock' => $this->previous_stock,
            'new_stock' => $this->new_stock,
            'reason' => $this->reason,
            'status' => $this->status,
            'approved_by_id' => $this->approved_by_id,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->getRelation('approvedBy')?->name),
            'approved_at' => $this->approved_at?->toISOString(),
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->getRelation('createdBy')?->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
