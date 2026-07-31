<?php

declare(strict_types=1);

namespace App\Http\Resources\Meal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MealResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'meal_code' => $this->meal_code,
            'category_id' => $this->category_id,
            'meal_type_id' => $this->meal_type_id,
            'kitchen_id' => $this->kitchen_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'ingredients' => $this->ingredients,
            'allergens' => $this->allergens,
            'spice_level' => $this->spice_level,
            'spice_level_label' => $this->spice_level_label,
            'serving_size' => $this->serving_size,
            'unit' => $this->unit,
            'meal_image' => $this->meal_image ? Storage::disk('public')->url($this->meal_image) : null,
            'thumbnail' => $this->thumbnail ? Storage::disk('public')->url($this->thumbnail) : null,
            'gallery' => $this->gallery ? array_map(fn ($path) => Storage::disk('public')->url($path), $this->gallery) : null,
            'barcode' => $this->barcode,
            'sku' => $this->sku,
            'hsn_code' => $this->hsn_code,
            'preparation_time' => $this->preparation_time,
            'calories' => $this->calories,
            'protein' => $this->protein,
            'carbohydrates' => $this->carbohydrates,
            'fat' => $this->fat,
            'fiber' => $this->fiber,
            'sugar' => $this->sugar,
            'sodium' => $this->sodium,
            'price' => $this->price,
            'offer_price' => $this->offer_price,
            'cost_price' => $this->cost_price,
            'tax_percentage' => $this->tax_percentage,
            'effective_price' => $this->effective_price,
            'discount_percentage' => $this->discount_percentage,
            'has_discount' => $this->hasDiscount(),
            'display_order' => $this->display_order,
            'availability_type' => $this->availability_type,
            'availability_type_label' => $this->availability_type_label,
            'availability_slots' => $this->availability_slots,
            'is_featured' => $this->is_featured,
            'is_recommended' => $this->is_recommended,
            'is_new' => $this->is_new,
            'is_bestseller' => $this->is_bestseller,
            'is_customizable' => $this->is_customizable,
            'requires_preparation' => $this->requires_preparation,
            'average_rating' => (float) ($this->average_rating ?? 0),
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'status' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->value : $this->status,
            'status_label' => $this->status instanceof \App\Enums\StatusEnum ? $this->status->label() : ucfirst($this->status ?? ''),
            'remarks' => $this->remarks,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'deleted_by' => $this->deleted_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'uuid' => $this->category->uuid,
                'name' => $this->category->name,
                'category_code' => $this->category->category_code,
            ]),
            'meal_type' => $this->whenLoaded('mealType', fn () => [
                'id' => $this->mealType->id,
                'uuid' => $this->mealType->uuid,
                'name' => $this->mealType->name,
                'type_code' => $this->mealType->type_code,
            ]),
            'kitchen' => $this->whenLoaded('kitchen', fn () => [
                'id' => $this->kitchen->id,
                'uuid' => $this->kitchen->uuid,
                'name' => $this->kitchen->name,
                'kitchen_code' => $this->kitchen->kitchen_code,
            ]),
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
        ];
    }
}
