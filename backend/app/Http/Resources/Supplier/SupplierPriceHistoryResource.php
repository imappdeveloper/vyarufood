<?php

declare(strict_types=1);

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierPriceHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'supplier_id' => $this->supplier_id,
            'supplier_name' => $this->whenLoaded('supplier', fn () => $this->supplier->company_name),
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item_name' => $this->whenLoaded('inventoryItem', fn () => $this->inventoryItem->name),
            'old_price' => $this->old_price,
            'new_price' => $this->new_price,
            'effective_from' => $this->effective_from?->toDateString(),
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
