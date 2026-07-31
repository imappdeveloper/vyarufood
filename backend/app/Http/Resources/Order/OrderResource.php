<?php

declare(strict_types=1);

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'order_number' => $this->order_number,
            'order_number_display' => $this->order_number_display,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer->full_name),
            'customer_email' => $this->whenLoaded('customer', fn () => $this->customer->email),
            'customer_phone' => $this->whenLoaded('customer', fn () => $this->customer->phone),
            'order_type' => $this->order_type,
            'subscription_id' => $this->subscription_id,
            'subscription_number' => $this->whenLoaded('subscription', fn () => $this->subscription->subscription_number),
            'plan_name' => $this->whenLoaded('subscription', fn () => $this->subscription->subscriptionPlan?->plan_name),
            'kitchen_id' => $this->kitchen_id,
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'delivery_zone_name' => $this->whenLoaded('deliveryZone', fn () => $this->deliveryZone->zone_name),
            'address_id' => $this->address_id,
            'address' => $this->whenLoaded('address', fn () => [
                'id' => $this->address->id,
                'address_line_1' => $this->address->address_line_1,
                'address_line_2' => $this->address->address_line_2,
                'city' => $this->address->city,
                'state' => $this->address->state,
                'pincode' => $this->address->pincode,
                'latitude' => $this->address->latitude,
                'longitude' => $this->address->longitude,
            ]),
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'meal_type_name' => $this->whenLoaded('mealType', fn () => $this->mealType->name),
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'coupon_amount' => $this->coupon_amount,
            'tax_amount' => $this->tax_amount,
            'delivery_charge' => $this->delivery_charge,
            'wallet_amount' => $this->wallet_amount,
            'total_amount' => $this->total_amount,
            'reward_points_used' => $this->reward_points_used,
            'reward_points_earned' => $this->reward_points_earned,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'order_status' => $this->order_status,
            'is_pending' => $this->is_pending,
            'is_active' => $this->is_active,
            'order_date' => $this->order_date?->toISOString(),
            'delivery_date' => $this->delivery_date?->toISOString(),
            'delivery_slot' => $this->delivery_slot,
            'delivery_instruction' => $this->delivery_instruction,
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancelled_by' => $this->cancelled_by,
            'cancellation_reason' => $this->cancellation_reason,
            'notes' => $this->notes,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->full_name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'status_history' => OrderStatusHistoryResource::collection($this->whenLoaded('statusHistory')),
            'cancellations' => OrderCancellationResource::collection($this->whenLoaded('cancellations')),
            'refunds' => OrderRefundResource::collection($this->whenLoaded('refunds')),
        ];
    }
}
