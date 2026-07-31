<?php

declare(strict_types=1);

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'request_number' => $this->request_number,
            'request_date' => $this->request_date?->format('Y-m-d'),
            'request_type' => $this->request_type,
            'requested_by' => $this->requested_by,
            'department' => $this->department,
            'priority' => $this->priority,
            'status' => $this->status,
            'expected_date' => $this->expected_date?->format('Y-m-d'),
            'remarks' => $this->remarks,
            'approved_by' => $this->approved_by,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->name),
            'approved_at' => $this->approved_at?->toISOString(),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'items_count' => $this->whenCounted('items'),
            'items' => PurchaseRequestItemResource::collection($this->whenLoaded('items')),
            'purchase_orders' => $this->whenLoaded('purchaseOrders'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
