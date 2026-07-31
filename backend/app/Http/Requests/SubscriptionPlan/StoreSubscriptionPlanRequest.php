<?php

declare(strict_types=1);

namespace App\Http\Requests\SubscriptionPlan;

use App\Support\BaseRequest;

class StoreSubscriptionPlanRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'plan_code' => ['required', 'string', 'max:50', 'unique:subscription_plans,plan_code'],
            'plan_name' => ['required', 'string', 'max:255', 'unique:subscription_plans,plan_name'],
            'description' => ['nullable', 'string'],
            'plan_type' => ['required', 'string', 'in:daily,weekly,15_days,monthly,quarterly,half_yearly,yearly,custom'],
            'billing_cycle' => ['required', 'string', 'in:one_time,weekly,monthly,quarterly,yearly'],
            'duration_days' => ['required', 'integer', 'min:1', 'max:3650'],
            'meal_category_id' => ['required', 'exists:meal_categories,id'],
            'kitchen_id' => ['nullable', 'exists:kitchens,id'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'offer_price' => ['nullable', 'numeric', 'min:0', 'lte:price'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'tax_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'delivery_charge' => ['nullable', 'numeric', 'min:0'],
            'joining_fee' => ['nullable', 'numeric', 'min:0'],
            'minimum_order_amount' => ['nullable', 'numeric', 'min:0'],
            'maximum_skip_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'maximum_pause_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'maximum_active_subscriptions' => ['nullable', 'integer', 'min:1', 'max:10'],
            'meal_selection_enabled' => ['nullable', 'boolean'],
            'custom_meal_selection' => ['nullable', 'boolean'],
            'default_meal_assignment' => ['nullable', 'boolean'],
            'carry_forward_skipped_meals' => ['nullable', 'boolean'],
            'weekend_delivery' => ['nullable', 'boolean'],
            'holiday_delivery' => ['nullable', 'boolean'],
            'allow_upgrade' => ['nullable', 'boolean'],
            'allow_downgrade' => ['nullable', 'boolean'],
            'allow_pause' => ['nullable', 'boolean'],
            'allow_resume' => ['nullable', 'boolean'],
            'allow_skip' => ['nullable', 'boolean'],
            'allow_cancel' => ['nullable', 'boolean'],
            'auto_renew' => ['nullable', 'boolean'],
            'renewal_discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'trial_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'is_popular' => ['nullable', 'boolean'],
            'is_recommended' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:active,inactive,draft'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'remarks' => ['nullable', 'string', 'max:1000'],
            'meals' => ['nullable', 'array'],
            'meals.*.meal_category_id' => ['required_with:meals', 'exists:meal_categories,id'],
            'meals.*.meal_type_id' => ['nullable', 'exists:meal_types,id'],
            'meals.*.meal_id' => ['required_with:meals', 'exists:meals,id'],
            'meals.*.day_of_week' => ['nullable', 'string', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'meals.*.quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
            'meals.*.is_optional' => ['nullable', 'boolean'],
            'meals.*.is_default' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'plan_code' => 'Plan Code',
            'plan_name' => 'Plan Name',
            'description' => 'Description',
            'plan_type' => 'Plan Type',
            'billing_cycle' => 'Billing Cycle',
            'duration_days' => 'Duration Days',
            'meal_category_id' => 'Meal Category',
            'kitchen_id' => 'Kitchen',
            'display_order' => 'Display Order',
            'price' => 'Price',
            'offer_price' => 'Offer Price',
            'security_deposit' => 'Security Deposit',
            'tax_percentage' => 'Tax Percentage',
            'delivery_charge' => 'Delivery Charge',
            'joining_fee' => 'Joining Fee',
            'minimum_order_amount' => 'Minimum Order Amount',
            'maximum_skip_days' => 'Maximum Skip Days',
            'maximum_pause_days' => 'Maximum Pause Days',
            'maximum_active_subscriptions' => 'Maximum Active Subscriptions',
            'meal_selection_enabled' => 'Meal Selection Enabled',
            'custom_meal_selection' => 'Custom Meal Selection',
            'default_meal_assignment' => 'Default Meal Assignment',
            'carry_forward_skipped_meals' => 'Carry Forward Skipped Meals',
            'weekend_delivery' => 'Weekend Delivery',
            'holiday_delivery' => 'Holiday Delivery',
            'allow_upgrade' => 'Allow Upgrade',
            'allow_downgrade' => 'Allow Downgrade',
            'allow_pause' => 'Allow Pause',
            'allow_resume' => 'Allow Resume',
            'allow_skip' => 'Allow Skip',
            'allow_cancel' => 'Allow Cancel',
            'auto_renew' => 'Auto Renew',
            'renewal_discount' => 'Renewal Discount',
            'trial_days' => 'Trial Days',
            'is_popular' => 'Is Popular',
            'is_recommended' => 'Is Recommended',
            'status' => 'Status',
            'starts_at' => 'Starts At',
            'ends_at' => 'Ends At',
            'remarks' => 'Remarks',
            'meals' => 'Meals',
        ];
    }
}
