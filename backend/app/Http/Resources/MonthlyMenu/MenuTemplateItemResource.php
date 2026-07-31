<?php

declare(strict_types=1);

namespace App\Http\Resources\MonthlyMenu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MenuTemplateItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'menu_template_id' => $this->menu_template_id,
            'day_name' => $this->day_name,
            'meal_category_id' => $this->meal_category_id,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'meal_type_id' => $this->meal_type_id,
            'meal_type_name' => $this->whenLoaded('mealType', fn () => $this->mealType->name),
            'display_order' => $this->display_order,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'meal_category' => $this->whenLoaded('mealCategory', fn () => [
                'id' => $this->mealCategory->id,
                'uuid' => $this->mealCategory->uuid,
                'name' => $this->mealCategory->name,
            ]),
            'meal' => $this->whenLoaded('meal', fn () => [
                'id' => $this->meal->id,
                'uuid' => $this->meal->uuid,
                'name' => $this->meal->name,
                'meal_code' => $this->meal->meal_code,
                'price' => $this->meal->price,
                'offer_price' => $this->meal->offer_price,
                'meal_image' => $this->meal->meal_image ? Storage::disk('public')->url($this->meal->meal_image) : null,
            ]),
            'meal_type' => $this->whenLoaded('mealType', fn () => [
                'id' => $this->mealType->id,
                'uuid' => $this->mealType->uuid,
                'name' => $this->mealType->name,
            ]),
        ];
    }
}
