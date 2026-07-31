<?php

declare(strict_types=1);

namespace App\Services\Checkout;

use App\Enums\StatusEnum;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Meal;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;

class CheckoutService implements CheckoutServiceInterface
{
    public function getCheckoutSummary(Customer $customer): array
    {
        $cart = Cart::with(['items.meal.category', 'items.meal.mealType'])
            ->where('customer_id', $customer->id)
            ->first();

        if (!$cart || $cart->items()->count() === 0) {
            throw new \Exception('Your cart is empty.');
        }

        $hasUnavailable = false;
        foreach ($cart->items as $item) {
            if (!$item->meal || $item->meal->status !== StatusEnum::Active) {
                $hasUnavailable = true;
                break;
            }
        }

        $addresses = CustomerAddress::where('customer_id', $customer->id)
            ->where('status', StatusEnum::Active)
            ->with(['city', 'area', 'pincode', 'deliveryZone'])
            ->get();

        $walletBalance = (float) $customer->wallet_balance;

        return [
            'cart' => $cart,
            'has_unavailable_items' => $hasUnavailable,
            'addresses' => $addresses,
            'wallet_balance' => $walletBalance,
        ];
    }

    public function placeOrder(Customer $customer, array $data): Order
    {
        return DB::transaction(function () use ($customer, $data) {
            $profileFields = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ], fn ($v) => $v !== null && $v !== '');

            if (! empty($profileFields)) {
                $customer->update($profileFields);
            }

            $cart = Cart::with(['items.meal.category', 'items.meal.mealType'])
                ->where('customer_id', $customer->id)
                ->first();

            if (!$cart || $cart->items()->count() === 0) {
                throw new \Exception('Your cart is empty.');
            }

            $address = CustomerAddress::where('id', $data['address_id'])
                ->where('customer_id', $customer->id)
                ->where('status', StatusEnum::Active)
                ->first();

            if (!$address) {
                throw new \Exception('Invalid delivery address.');
            }

            foreach ($cart->items as $item) {
                if (!$item->meal || $item->meal->status !== StatusEnum::Active) {
                    throw new \Exception("Meal \"{$item->meal?->name}\" is no longer available.");
                }
            }

            $subtotal = 0.0;
            $totalDiscount = 0.0;
            $taxableAmount = 0.0;
            $taxRate = 0.0;

            foreach ($cart->items as $item) {
                $meal = $item->meal;
                $effectivePrice = (float) $meal->effective_price;
                $itemDiscount = (float) $item->discount_amount;
                $itemTotal = (float) $item->total_price;

                $subtotal += $itemTotal + $itemDiscount;
                $totalDiscount += $itemDiscount;

                if ($meal->tax_percentage > 0) {
                    $taxableAmount += $itemTotal;
                    $taxRate = (float) $meal->tax_percentage;
                }
            }

            $taxAmount = $taxRate > 0 ? round($taxableAmount * ($taxRate / 100), 2) : 0;
            $deliveryCharge = $this->calculateDeliveryCharge($address->delivery_zone_id, $subtotal);
            $couponAmount = (float) $cart->coupon_amount;
            $walletAmount = (float) $cart->wallet_amount;

            $paymentMethod = $data['payment_method'] ?? 'upi';

            // Calculate order total (subtotal + tax + delivery - discounts - coupon)
            $total = $subtotal + $taxAmount + $deliveryCharge - $totalDiscount - $couponAmount;
            $total = max(0, $total);

            // If payment method is wallet and no wallet was applied in cart, auto-apply
            if ($paymentMethod === 'wallet' && $walletAmount <= 0) {
                $walletAmount = min($total, (float) $customer->wallet_balance);
            }

            if ($walletAmount > (float) $customer->wallet_balance) {
                throw new \Exception('Insufficient wallet balance.');
            }

            // Amount due after wallet deduction
            $amountDue = max(0, $total - $walletAmount);

            // Determine payment status
            $paymentStatus = match ($paymentMethod) {
                'wallet' => $amountDue <= 0 ? 'paid' : 'pending',
                'cod'    => 'pending',
                default  => 'pending',
            };

            $orderNumber = $this->generateOrderNumber();

            $order = Order::create([
                'order_number' => $orderNumber,
                'order_type' => 'single',
                'customer_id' => $customer->id,
                'address_id' => $address->id,
                'delivery_zone_id' => $address->delivery_zone_id,
                'order_date' => now()->toDateString(),
                'delivery_date' => $data['delivery_date'] ?? now()->addDay()->toDateString(),
                'quantity' => $cart->items()->sum('quantity'),
                'unit_price' => $subtotal / max(1, $cart->items()->sum('quantity')),
                'subtotal' => $subtotal,
                'discount_amount' => $totalDiscount,
                'coupon_amount' => $couponAmount,
                'tax_amount' => $taxAmount,
                'delivery_charge' => $deliveryCharge,
                'total_amount' => $total,
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentMethod,
                'order_status' => 'pending',
                'delivery_slot' => $data['delivery_slot'] ?? null,
                'delivery_instruction' => $data['delivery_instruction'] ?? null,
                'wallet_amount' => $walletAmount,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cart->items as $cartItem) {
                $meal = $cartItem->meal;
                OrderItem::create([
                    'order_id' => $order->id,
                    'meal_id' => $meal->id,
                    'meal_name' => $meal->name,
                    'meal_category_id' => $meal->meal_category_id,
                    'meal_type_id' => $meal->meal_type_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => (float) $meal->effective_price,
                    'tax' => round((float) $cartItem->total_price * $taxRate / 100, 2),
                    'discount' => (float) $cartItem->discount_amount,
                    'total' => (float) $cartItem->total_price,
                    'remarks' => $cartItem->special_instructions,
                ]);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => 'new',
                'to_status' => 'pending',
                'reason' => 'Order placed by customer',
            ]);

            if ($walletAmount > 0) {
                $customer->deductFromWallet($walletAmount);
            }

            $cart->delete();

            return $order->fresh(['orderItems.meal', 'address', 'customer']);
        });
    }

    public function calculateDeliveryCharge(?int $deliveryZoneId, float $subtotal): float
    {
        if (!$deliveryZoneId) {
            return 0.0;
        }

        $zone = \App\Models\Master\DeliveryZone::find($deliveryZoneId);
        if (!$zone) {
            return 0.0;
        }

        $charge = (float) ($zone->delivery_charge ?? 0);

        if (($zone->free_delivery_above ?? 0) > 0 && $subtotal >= (float) $zone->free_delivery_above) {
            return 0.0;
        }

        return $charge;
    }

    private function generateOrderNumber(): string
    {
        $lastOrder = Order::withTrashed()->orderBy('id', 'desc')->first();
        $nextId = $lastOrder ? $lastOrder->id + 1 : 1;
        return 'ORD-' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
    }
}
