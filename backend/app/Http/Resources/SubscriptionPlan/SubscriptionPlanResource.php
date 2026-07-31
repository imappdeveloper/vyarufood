<?php

declare(strict_types=1);

namespace App\Http\Resources\SubscriptionPlan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'plan_code' => $this->plan_code,
            'plan_name' => $this->plan_name,
            'slug' => $this->slug,
            'description' => $this->description,
            'plan_type' => $this->plan_type,
            'billing_cycle' => $this->billing_cycle,
            'duration_days' => $this->duration_days,
            'meal_category_id' => $this->meal_category_id,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'kitchen_id' => $this->kitchen_id,
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'display_order' => $this->display_order,
            'price' => $this->price,
            'offer_price' => $this->offer_price,
            'effective_price' => ($this->offer_price > 0 && $this->offer_price < $this->price)
                ? $this->offer_price
                : $this->price,
            'security_deposit' => $this->security_deposit,
            'tax_percentage' => $this->tax_percentage,
            'delivery_charge' => $this->delivery_charge,
            'joining_fee' => $this->joining_fee,
            'minimum_order_amount' => $this->minimum_order_amount,
            'maximum_skip_days' => $this->maximum_skip_days,
            'maximum_pause_days' => $this->maximum_pause_days,
            'maximum_active_subscriptions' => $this->maximum_active_subscriptions,
            'meal_selection_enabled' => $this->meal_selection_enabled,
            'custom_meal_selection' => $this->custom_meal_selection,
            'default_meal_assignment' => $this->default_meal_assignment,
            'carry_forward_skipped_meals' => $this->carry_forward_skipped_meals,
            'weekend_delivery' => $this->weekend_delivery,
            'holiday_delivery' => $this->holiday_delivery,
            'allow_upgrade' => $this->allow_upgrade,
            'allow_downgrade' => $this->allow_downgrade,
            'allow_pause' => $this->allow_pause,
            'allow_resume' => $this->allow_resume,
            'allow_skip' => $this->allow_skip,
            'allow_cancel' => $this->allow_cancel,
            'auto_renew' => $this->auto_renew,
            'renewal_discount' => $this->renewal_discount,
            'trial_days' => $this->trial_days,
            'is_popular' => $this->is_popular,
            'is_recommended' => $this->is_recommended,
            'status' => $this->status,
            'status_label' => ucfirst($this->status ?? ''),
            'is_active' => $this->status === 'active',
            'starts_at' => $this->starts_at?->toISOString(),
            'ends_at' => $this->ends_at?->toISOString(),
            'remarks' => $this->remarks,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'items_count' => $this->whenCounted('planMeals'),
            'kitchen' => $this->whenLoaded('kitchen', fn () => [
                'id' => $this->kitchen->id,
                'uuid' => $this->kitchen->uuid,
                'name' => $this->kitchen->name,
            ]),
            'meal_category' => $this->whenLoaded('mealCategory', fn () => [
                'id' => $this->mealCategory->id,
                'uuid' => $this->mealCategory->uuid,
                'name' => $this->mealCategory->name,
            ]),
            'plan_meals' => SubscriptionPlanMealResource::collection($this->whenLoaded('planMeals')),
        ];
    }
}
