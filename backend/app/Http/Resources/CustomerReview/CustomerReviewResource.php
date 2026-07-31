<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerReview;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CustomerReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'customer_id' => $this->customer_id,
            'meal_id' => $this->meal_id,
            'order_id' => $this->order_id,
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'photo' => $this->photo ? Storage::disk('public')->url($this->photo) : null,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'is_verified_purchase' => $this->is_verified_purchase,
            'admin_response' => $this->admin_response,
            'admin_responded_at' => $this->admin_responded_at?->toIso8601String(),
            'rejection_reason' => $this->when($this->status === 'rejected', $this->rejection_reason),
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'full_name' => $this->customer->full_name ?? $this->customer->name ?? null,
                'email' => $this->customer->email,
                'avatar' => $this->customer->avatar ?? null,
            ]),
            'meal' => $this->whenLoaded('meal', fn () => [
                'id' => $this->meal->id,
                'uuid' => $this->meal->uuid,
                'name' => $this->meal->name,
                'slug' => $this->meal->slug,
                'meal_image' => $this->meal->meal_image ? Storage::disk('public')->url($this->meal->meal_image) : null,
            ]),
            'order_info' => $this->whenLoaded('order', fn () => [
                'id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'order_number_display' => 'ORD-' . str_pad((string) $this->order->id, 6, '0', STR_PAD_LEFT),
            ]),
        ];
    }
}
