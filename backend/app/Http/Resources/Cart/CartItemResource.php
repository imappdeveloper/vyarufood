<?php

declare(strict_types=1);

namespace App\Http\Resources\Cart;

use App\Enums\StatusEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'meal_id' => $this->meal_id,
            'meal_name' => $this->meal?->name ?? 'Unknown Meal',
            'meal_slug' => $this->meal?->slug ?? '',
            'meal_image' => $this->meal?->meal_image ? Storage::disk('public')->url($this->meal->meal_image) : null,
            'meal_type' => $this->meal?->mealType?->name ?? null,
            'category_name' => $this->meal?->category?->name ?? null,
            'quantity' => (int) $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'original_price' => $this->meal ? (float) $this->meal->price : (float) $this->unit_price,
            'discount_amount' => (float) $this->discount_amount,
            'total_price' => (float) $this->total_price,
            'special_instructions' => $this->special_instructions,
            'is_available' => $this->meal && $this->meal->status === StatusEnum::Active,
            'dietary_type' => $this->meal?->dietary_type ?? null,
            'meal_status' => $this->meal?->status?->value ?? 'inactive',
        ];
    }
}
