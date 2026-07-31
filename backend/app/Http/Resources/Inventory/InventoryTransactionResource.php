<?php
declare(strict_types=1);

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->getRelation('inventoryItem')?->item_name),
            'inventory_item_code' => $this->whenLoaded('inventoryItem', fn () => $this->getRelation('inventoryItem')?->item_code),
            'transaction_type' => $this->transaction_type,
            'transaction_date' => $this->transaction_date?->toISOString(),
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'reference_number' => $this->reference_number,
            'batch_id' => $this->batch_id,
            'batch_number' => $this->whenLoaded('batch', fn () => $this->getRelation('batch')?->batch_number),
            'quantity' => $this->quantity,
            'unit_cost' => $this->unit_cost,
            'total_cost' => $this->total_cost,
            'running_balance' => $this->running_balance,
            'from_location' => $this->from_location,
            'to_location' => $this->to_location,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->getRelation('createdBy')?->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
