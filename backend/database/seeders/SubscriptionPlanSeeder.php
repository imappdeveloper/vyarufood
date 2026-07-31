<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPlanMeal;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'plan_code' => 'DLY-BRK-001',
                'plan_name' => 'Daily Breakfast Plan',
                'slug' => 'daily-breakfast-plan',
                'description' => 'Start your day with a wholesome South Indian breakfast delivered fresh to your door every morning.',
                'plan_type' => 'daily',
                'billing_cycle' => 'monthly',
                'duration_days' => 30,
                'meal_category_id' => 1,
                'kitchen_id' => 1,
                'display_order' => 1,
                'price' => 2499.00,
                'offer_price' => 1999.00,
                'security_deposit' => 500.00,
                'tax_percentage' => 5.00,
                'delivery_charge' => 0.00,
                'joining_fee' => 199.00,
                'minimum_order_amount' => 0.00,
                'maximum_skip_days' => 5,
                'maximum_pause_days' => 7,
                'maximum_active_subscriptions' => 1,
                'meal_selection_enabled' => false,
                'custom_meal_selection' => false,
                'default_meal_assignment' => true,
                'carry_forward_skipped_meals' => false,
                'weekend_delivery' => true,
                'holiday_delivery' => false,
                'allow_upgrade' => true,
                'allow_downgrade' => false,
                'allow_pause' => true,
                'allow_resume' => true,
                'allow_skip' => true,
                'allow_cancel' => true,
                'auto_renew' => true,
                'renewal_discount' => 10.00,
                'trial_days' => 3,
                'is_popular' => true,
                'is_recommended' => false,
                'status' => 'active',
                'starts_at' => '2026-01-01 00:00:00',
            ],
            [
                'plan_code' => 'WK-LCH-001',
                'plan_name' => 'Weekly Lunch Thali',
                'slug' => 'weekly-lunch-thali',
                'description' => 'Enjoy a complete South Indian thali for lunch every weekday. Curries, rice, sambar, rasam, curd, and dessert.',
                'plan_type' => 'weekly',
                'billing_cycle' => 'weekly',
                'duration_days' => 7,
                'meal_category_id' => 2,
                'kitchen_id' => 1,
                'display_order' => 2,
                'price' => 899.00,
                'offer_price' => 749.00,
                'security_deposit' => 0.00,
                'tax_percentage' => 5.00,
                'delivery_charge' => 30.00,
                'joining_fee' => 0.00,
                'minimum_order_amount' => 0.00,
                'maximum_skip_days' => 2,
                'maximum_pause_days' => 3,
                'maximum_active_subscriptions' => 2,
                'meal_selection_enabled' => true,
                'custom_meal_selection' => true,
                'default_meal_assignment' => false,
                'carry_forward_skipped_meals' => false,
                'weekend_delivery' => false,
                'holiday_delivery' => false,
                'allow_upgrade' => true,
                'allow_downgrade' => true,
                'allow_pause' => true,
                'allow_resume' => true,
                'allow_skip' => true,
                'allow_cancel' => true,
                'auto_renew' => false,
                'renewal_discount' => 0.00,
                'trial_days' => 0,
                'is_popular' => false,
                'is_recommended' => true,
                'status' => 'active',
                'starts_at' => '2026-01-01 00:00:00',
            ],
            [
                'plan_code' => 'MTH-ALL-001',
                'plan_name' => 'Monthly All Meals Premium',
                'slug' => 'monthly-all-meals-premium',
                'description' => 'Premium monthly subscription covering breakfast, lunch, and dinner. Includes weekend special meals and festival specials.',
                'plan_type' => 'monthly',
                'billing_cycle' => 'monthly',
                'duration_days' => 30,
                'meal_category_id' => 4,
                'kitchen_id' => 1,
                'display_order' => 3,
                'price' => 8999.00,
                'offer_price' => 7499.00,
                'security_deposit' => 1500.00,
                'tax_percentage' => 5.00,
                'delivery_charge' => 0.00,
                'joining_fee' => 499.00,
                'minimum_order_amount' => 0.00,
                'maximum_skip_days' => 10,
                'maximum_pause_days' => 15,
                'maximum_active_subscriptions' => 1,
                'meal_selection_enabled' => true,
                'custom_meal_selection' => true,
                'default_meal_assignment' => true,
                'carry_forward_skipped_meals' => true,
                'weekend_delivery' => true,
                'holiday_delivery' => true,
                'allow_upgrade' => true,
                'allow_downgrade' => false,
                'allow_pause' => true,
                'allow_resume' => true,
                'allow_skip' => true,
                'allow_cancel' => true,
                'auto_renew' => true,
                'renewal_discount' => 15.00,
                'trial_days' => 7,
                'is_popular' => true,
                'is_recommended' => true,
                'status' => 'active',
                'starts_at' => '2026-01-01 00:00:00',
            ],
        ];

        foreach ($plans as $planData) {
            $plan = SubscriptionPlan::create($planData);
            $this->command->info("Created plan: {$plan->plan_name}");
        }

        $mealData = [
            1 => [
                ['meal_category_id' => 1, 'meal_type_id' => 1, 'meal_id' => 1, 'day_of_week' => null, 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
                ['meal_category_id' => 1, 'meal_type_id' => 1, 'meal_id' => 10, 'day_of_week' => 'saturday', 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
            ],
            2 => [
                ['meal_category_id' => 2, 'meal_type_id' => 1, 'meal_id' => 2, 'day_of_week' => 'monday', 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
                ['meal_category_id' => 2, 'meal_type_id' => 1, 'meal_id' => 3, 'day_of_week' => 'tuesday', 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
                ['meal_category_id' => 2, 'meal_type_id' => 1, 'meal_id' => 7, 'day_of_week' => 'wednesday', 'quantity' => 1, 'is_optional' => true, 'is_default' => true],
            ],
            3 => [
                ['meal_category_id' => 4, 'meal_type_id' => 1, 'meal_id' => 1, 'day_of_week' => null, 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
                ['meal_category_id' => 4, 'meal_type_id' => 2, 'meal_id' => 4, 'day_of_week' => null, 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
                ['meal_category_id' => 4, 'meal_type_id' => 3, 'meal_id' => 5, 'day_of_week' => null, 'quantity' => 1, 'is_optional' => false, 'is_default' => true],
            ],
        ];

        foreach ($mealData as $planId => $meals) {
            foreach ($meals as $meal) {
                SubscriptionPlanMeal::create(array_merge($meal, ['subscription_plan_id' => $planId]));
            }
        }

        $this->command->info('Subscription plan seeded successfully with meal configurations.');
    }
}
