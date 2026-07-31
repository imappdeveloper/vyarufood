<?php

declare(strict_types=1);

namespace App\Http\Resources\WeeklyMenu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerMealSelectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'customer_id' => $this->customer_id,
            'subscription_id' => $this->subscription_id,
            'weekly_menu_item_id' => $this->weekly_menu_item_id,
            'weekly_menu_id' => $this->weekly_menu_id,
            'menu_date' => $this->menu_date,
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'meal_category_id' => $this->meal_category_id,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer->name),
            'customer_email' => $this->whenLoaded('customer', fn () => $this->customer->email),
            'selection_status' => $this->selection_status,
            'selected_at' => $this->selected_at?->toISOString(),
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'uuid' => $this->customer->uuid,
                'name' => $this->customer->name,
                'email' => $this->customer->email,
            ]),
            'meal' => $this->whenLoaded('meal', fn () => [
                'id' => $this->meal->id,
                'uuid' => $this->meal->uuid,
                'name' => $this->meal->name,
                'meal_code' => $this->meal->meal_code,
            ]),
            'meal_category' => $this->whenLoaded('mealCategory', fn () => [
                'id' => $this->mealCategory->id,
                'uuid' => $this->mealCategory->uuid,
                'name' => $this->mealCategory->name,
            ]),
            'weekly_menu_item' => $this->whenLoaded('weeklyMenuItem', fn () => [
                'id' => $this->weeklyMenuItem->id,
                'uuid' => $this->weeklyMenuItem->uuid,
                'menu_date' => $this->weeklyMenuItem->menu_date?->format('Y-m-d'),
            ]),
        ];
    }
}
