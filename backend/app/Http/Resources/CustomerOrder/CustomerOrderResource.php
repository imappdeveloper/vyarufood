<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerOrder;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'order_number' => $this->order_number,
            'order_number_display' => $this->order_number_display,
            'order_type' => $this->order_type,
            'order_date' => $this->order_date?->toDateString(),
            'delivery_date' => $this->delivery_date?->toDateString(),
            'delivery_slot' => $this->delivery_slot,
            'delivery_instruction' => $this->delivery_instruction,
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'subtotal' => (float) $this->subtotal,
            'discount_amount' => (float) $this->discount_amount,
            'coupon_amount' => (float) $this->coupon_amount,
            'tax_amount' => (float) $this->tax_amount,
            'delivery_charge' => (float) $this->delivery_charge,
            'total_amount' => (float) $this->total_amount,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'order_status' => $this->order_status,
            'wallet_amount' => (float) $this->wallet_amount,
            'notes' => $this->notes,
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancellation_reason' => $this->cancellation_reason,
            'address' => [
                'id' => $this->address?->id,
                'address_line_1' => $this->address?->address_line_1,
                'address_line_2' => $this->address?->address_line_2,
                'city' => $this->address?->city?->name,
                'state' => $this->address?->state?->name,
                'pincode' => $this->address?->pincode?->pincode,
                'full_address' => $this->address?->full_address,
            ],
            'order_items' => CustomerOrderItemResource::collection($this->whenLoaded('orderItems')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
