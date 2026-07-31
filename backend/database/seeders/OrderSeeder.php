<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Customer;
use App\Models\CustomerSubscription;
use App\Models\Meal;
use App\Models\Kitchen;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $meals = Meal::all();
        $kitchens = Kitchen::all();
        $subscriptions = CustomerSubscription::all();

        if ($customers->isEmpty() || $meals->isEmpty()) {
            $this->command->warn('No customers or meals found. Skipping order seeding.');
            return;
        }

        \DB::statement('SET FOREIGN_KEY_CHECKS=0');
        OrderStatusHistory::truncate();
        OrderItem::truncate();
        Order::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'refunded'];
        $orderTypes = ['subscription', 'single'];

        $orderCount = 0;
        $nextNumber = 1;

        for ($i = 0; $i < 20; $i++) {
            $customer = $customers->random();
            $meal = $meals->random();
            $kitchen = $kitchens->first();
            $status = $statuses[array_rand($statuses)];
            $paymentStatus = $status === 'cancelled' ? 'refunded' : $paymentStatuses[array_rand($paymentStatuses)];
            $orderType = $orderTypes[array_rand($orderTypes)];
            $quantity = rand(1, 3);
            $unitPrice = (float) ($meal->price ?? 150);
            $subtotal = $unitPrice * $quantity;
            $taxAmount = round($subtotal * 0.05, 2);
            $deliveryCharge = 30.00;
            $totalAmount = $subtotal + $taxAmount + $deliveryCharge;
            $orderDate = now()->subDays(rand(0, 14));
            $deliveryDate = $orderDate->copy()->addDay();

            $subscription = ($orderType === 'subscription' && $subscriptions->isNotEmpty()) ? $subscriptions->random() : null;

            $order = Order::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'order_number' => 'ORD-' . str_pad((string) $nextNumber++, 6, '0', STR_PAD_LEFT),
                'order_type' => $orderType,
                'customer_id' => $customer->id,
                'subscription_id' => $subscription?->id,
                'kitchen_id' => $kitchen?->id,
                'order_date' => $orderDate->toDateString(),
                'delivery_date' => $deliveryDate->toDateString(),
                'meal_category_id' => $meal->meal_category_id ?? null,
                'meal_type_id' => $meal->meal_type_id ?? null,
                'meal_id' => $meal->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'delivery_charge' => $deliveryCharge,
                'total_amount' => $totalAmount,
                'payment_status' => $paymentStatus,
                'payment_method' => 'wallet',
                'order_status' => $status,
                'delivery_slot' => '12:00-13:00',
                'notes' => 'Seeded order',
            ]);

            OrderItem::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'order_id' => $order->id,
                'meal_id' => $meal->id,
                'meal_name' => $meal->name ?? 'Meal ' . $meal->id,
                'meal_category_id' => $meal->meal_category_id ?? null,
                'meal_type_id' => $meal->meal_type_id ?? null,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'tax' => $taxAmount,
                'total' => $subtotal + $taxAmount,
            ]);

            OrderStatusHistory::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'order_id' => $order->id,
                'from_status' => 'pending',
                'to_status' => $status,
                'reason' => 'Order created via seeder',
            ]);

            $orderCount++;
        }

        $this->command->info("Orders seeded successfully ({$orderCount} orders).");
    }
}
