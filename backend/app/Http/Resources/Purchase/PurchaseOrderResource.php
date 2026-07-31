<?php

declare(strict_types=1);

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'po_number' => $this->po_number,
            'supplier_id' => $this->supplier_id,
            'supplier_name' => $this->whenLoaded('supplier', fn () => $this->supplier->company_name),
            'purchase_request_id' => $this->purchase_request_id,
            'purchase_request_number' => $this->whenLoaded('purchaseRequest', fn () => $this->purchaseRequest->request_number),
            'order_date' => $this->order_date?->format('Y-m-d'),
            'expected_delivery_date' => $this->expected_delivery_date?->format('Y-m-d'),
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'tax_amount' => $this->tax_amount,
            'shipping_charge' => $this->shipping_charge,
            'other_charges' => $this->other_charges,
            'grand_total' => $this->grand_total,
            'payment_terms' => $this->payment_terms,
            'payment_status' => $this->payment_status,
            'order_status' => $this->order_status,
            'remarks' => $this->remarks,
            'approved_by' => $this->approved_by,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->name),
            'approved_at' => $this->approved_at?->toISOString(),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'items_count' => $this->whenCounted('items'),
            'items' => PurchaseOrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
