<?php

declare(strict_types=1);

namespace App\Http\Resources\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');

        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'items' => CartItemResource::collection($items instanceof \Illuminate\Support\Collection ? $items : collect()),
            'item_count' => $items instanceof \Illuminate\Support\Collection ? $items->sum('quantity') : 0,
            'subtotal' => (float) $this->subtotal,
            'tax_amount' => (float) $this->tax_amount,
            'tax_percentage' => (float) $this->tax_percentage,
            'delivery_charge' => (float) $this->delivery_charge,
            'discount_amount' => (float) $this->discount_amount,
            'coupon_amount' => (float) $this->coupon_amount,
            'coupon_code' => $this->coupon_code,
            'wallet_amount' => (float) $this->wallet_amount,
            'total_amount' => (float) $this->total_amount,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
