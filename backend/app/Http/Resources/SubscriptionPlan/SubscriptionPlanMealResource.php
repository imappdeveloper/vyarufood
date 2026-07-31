<?php

declare(strict_types=1);

namespace App\Http\Resources\SubscriptionPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanMealResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'subscription_plan_id' => $this->subscription_plan_id,
            'meal_category_id' => $this->meal_category_id,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'meal_type_id' => $this->meal_type_id,
            'meal_type_name' => $this->whenLoaded('mealType', fn () => $this->mealType->name),
            'meal_id' => $this->meal_id,
            'meal_name' => $this->whenLoaded('meal', fn () => $this->meal->name),
            'day_of_week' => $this->day_of_week,
            'quantity' => $this->quantity,
            'is_optional' => $this->is_optional,
            'is_default' => $this->is_default,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
