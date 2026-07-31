<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CustomerSubscription;
use App\Models\Customer;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class CustomerSubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $plans = SubscriptionPlan::all();

        if ($customers->isEmpty() || $plans->isEmpty()) {
            $this->command->warn('No customers or plans found. Skipping subscription seeding.');
            return;
        }

        $subscriptionData = [
            [
                'customer_index' => 0,
                'plan_index' => 0,
                'start_date' => now()->subDays(15)->toDateString(),
                'end_date' => now()->addDays(15)->toDateString(),
                'activation_date' => now()->subDays(14)->toDateString(),
                'subscription_status' => 'active',
                'payment_status' => 'paid',
                'remaining_meals' => 15,
                'consumed_meals' => 15,
                'skipped_meals' => 0,
                'next_delivery_date' => now()->addDay()->toDateString(),
                'auto_renew' => true,
            ],
            [
                'customer_index' => 0,
                'plan_index' => 2,
                'start_date' => now()->subDays(30)->toDateString(),
                'end_date' => now()->addDays(30)->toDateString(),
                'activation_date' => now()->subDays(29)->toDateString(),
                'subscription_status' => 'active',
                'payment_status' => 'paid',
                'remaining_meals' => 45,
                'consumed_meals' => 30,
                'skipped_meals' => 5,
                'next_delivery_date' => now()->toDateString(),
                'auto_renew' => true,
            ],
            [
                'customer_index' => 1,
                'plan_index' => 1,
                'start_date' => now()->subDays(7)->toDateString(),
                'end_date' => now()->addDays(7)->toDateString(),
                'activation_date' => now()->subDays(6)->toDateString(),
                'subscription_status' => 'active',
                'payment_status' => 'paid',
                'remaining_meals' => 3,
                'consumed_meals' => 2,
                'skipped_meals' => 0,
                'next_delivery_date' => now()->addDay()->toDateString(),
                'auto_renew' => false,
            ],
            [
                'customer_index' => 2,
                'plan_index' => 0,
                'start_date' => now()->subDays(45)->toDateString(),
                'end_date' => now()->subDays(15)->toDateString(),
                'activation_date' => now()->subDays(44)->toDateString(),
                'subscription_status' => 'expired',
                'payment_status' => 'paid',
                'remaining_meals' => 0,
                'consumed_meals' => 25,
                'skipped_meals' => 5,
                'next_delivery_date' => null,
                'auto_renew' => false,
            ],
            [
                'customer_index' => 1,
                'plan_index' => 2,
                'start_date' => now()->subDays(3)->toDateString(),
                'end_date' => now()->addDays(27)->toDateString(),
                'activation_date' => null,
                'subscription_status' => 'pending',
                'payment_status' => 'pending',
                'remaining_meals' => 30,
                'consumed_meals' => 0,
                'skipped_meals' => 0,
                'next_delivery_date' => null,
                'auto_renew' => false,
            ],
        ];

        foreach ($subscriptionData as $index => $data) {
            $customer = $customers[$data['customer_index'] % $customers->count()] ?? $customers->first();
            $plan = $plans[$data['plan_index'] % $plans->count()] ?? $plans->first();

            if (! $customer || ! $plan) {
                continue;
            }

            $subscriptionNumber = 'SUB-' . str_pad((string) ($index + 1), 6, '0', STR_PAD_LEFT);

            CustomerSubscription::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'subscription_number' => $subscriptionNumber,
                'customer_id' => $customer->id,
                'subscription_plan_id' => $plan->id,
                'kitchen_id' => $plan->kitchen_id,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'activation_date' => $data['activation_date'],
                'billing_cycle' => $plan->billing_cycle,
                'meal_category_id' => $plan->meal_category_id,
                'subscription_status' => $data['subscription_status'],
                'payment_status' => $data['payment_status'],
                'remaining_meals' => $data['remaining_meals'],
                'consumed_meals' => $data['consumed_meals'],
                'skipped_meals' => $data['skipped_meals'],
                'next_delivery_date' => $data['next_delivery_date'],
                'auto_renew' => $data['auto_renew'],
                'wallet_adjustment' => $plan->price,
                'remarks' => 'Seeded subscription',
            ]);
        }

        $this->command->info('Customer subscriptions seeded successfully (5 subscriptions).');
    }
}
