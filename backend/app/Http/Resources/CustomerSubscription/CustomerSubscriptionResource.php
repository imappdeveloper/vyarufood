<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerSubscriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'subscription_number' => $this->subscription_number,
            'subscription_number_display' => $this->subscription_number_display,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->whenLoaded('customer', fn () => $this->customer->full_name),
            'customer_email' => $this->whenLoaded('customer', fn () => $this->customer->email),
            'subscription_plan_id' => $this->subscription_plan_id,
            'plan_name' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->plan_name),
            'plan_code' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->plan_code),
            'plan_price' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->price),
            'plan_duration_days' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->duration_days),
            'plan_allow_skip' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->allow_skip),
            'plan_allow_pause' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->allow_pause),
            'plan_allow_resume' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->allow_resume),
            'plan_allow_cancel' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->allow_cancel),
            'plan_allow_upgrade' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->allow_upgrade),
            'plan_allow_downgrade' => $this->whenLoaded('subscriptionPlan', fn () => $this->subscriptionPlan->allow_downgrade),
            'kitchen_id' => $this->kitchen_id,
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'meal_category_id' => $this->meal_category_id,
            'meal_category_name' => $this->whenLoaded('mealCategory', fn () => $this->mealCategory->name),
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
            'activation_date' => $this->activation_date?->toISOString(),
            'billing_cycle' => $this->billing_cycle,
            'subscription_status' => $this->subscription_status,
            'subscription_status_label' => ucfirst($this->subscription_status ?? ''),
            'payment_status' => $this->payment_status,
            'payment_status_label' => ucfirst($this->payment_status ?? ''),
            'is_active' => $this->is_active,
            'wallet_adjustment' => $this->wallet_adjustment,
            'remaining_meals' => $this->remaining_meals,
            'consumed_meals' => $this->consumed_meals,
            'skipped_meals' => $this->skipped_meals,
            'total_meals' => $this->total_meals,
            'progress_percentage' => $this->progress_percentage,
            'days_remaining' => $this->days_remaining,
            'paused_days' => $this->paused_days,
            'pause_start' => $this->pause_start?->toISOString(),
            'pause_end' => $this->pause_end?->toISOString(),
            'next_delivery_date' => $this->next_delivery_date?->toISOString(),
            'delivery_slot' => $this->delivery_slot,
            'auto_renew' => $this->auto_renew,
            'renewal_date' => $this->renewal_date?->toISOString(),
            'cancellation_date' => $this->cancellation_date?->toISOString(),
            'cancellation_reason' => $this->cancellation_reason,
            'refund_amount' => $this->refund_amount,
            'remarks' => $this->remarks,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy?->name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy?->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'uuid' => $this->customer->uuid,
                'name' => $this->customer->full_name,
                'email' => $this->customer->email,
                'phone' => $this->customer->phone ?? null,
            ]),
            'subscription_plan' => $this->whenLoaded('subscriptionPlan', fn () => [
                'id' => $this->subscriptionPlan->id,
                'uuid' => $this->subscriptionPlan->uuid,
                'plan_name' => $this->subscriptionPlan->plan_name,
                'plan_code' => $this->subscriptionPlan->plan_code,
                'price' => $this->subscriptionPlan->price,
                'duration_days' => $this->subscriptionPlan->duration_days,
                'allow_skip' => $this->subscriptionPlan->allow_skip,
                'allow_pause' => $this->subscriptionPlan->allow_pause,
                'allow_resume' => $this->subscriptionPlan->allow_resume,
                'allow_cancel' => $this->subscriptionPlan->allow_cancel,
                'allow_upgrade' => $this->subscriptionPlan->allow_upgrade,
                'allow_downgrade' => $this->subscriptionPlan->allow_downgrade,
            ]),
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
            'pause_history' => CustomerSubscriptionPauseHistoryResource::collection($this->whenLoaded('pauseHistory')),
            'skip_history' => CustomerSubscriptionSkipHistoryResource::collection($this->whenLoaded('skipHistory')),
            'upgrade_history' => CustomerSubscriptionUpgradeHistoryResource::collection($this->whenLoaded('upgradeHistory')),
            'renew_history' => CustomerSubscriptionRenewHistoryResource::collection($this->whenLoaded('renewHistory')),
            'status_history' => CustomerSubscriptionStatusHistoryResource::collection($this->whenLoaded('statusHistory')),
        ];
    }
}
