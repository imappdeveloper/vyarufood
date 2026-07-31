<?php

declare(strict_types=1);

namespace App\Services\Cart;

use App\Enums\StatusEnum;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Meal;
use Illuminate\Support\Facades\DB;

class CartService implements CartServiceInterface
{
    public function getCart(Customer $customer): ?Cart
    {
        return Cart::with(['items.meal.category', 'items.meal.mealType'])
            ->where('customer_id', $customer->id)
            ->first();
    }

    public function addItem(Customer $customer, int $mealId, int $quantity = 1, ?string $specialInstructions = null): Cart
    {
        return DB::transaction(function () use ($customer, $mealId, $quantity, $specialInstructions) {
            $meal = Meal::findOrFail($mealId);

            if ($meal->status !== StatusEnum::Active) {
                throw new \Exception('This meal is currently unavailable.');
            }

            $cart = Cart::firstOrCreate(
                ['customer_id' => $customer->id],
                [
                    'subtotal' => 0,
                    'tax_amount' => 0,
                    'delivery_charge' => 0,
                    'discount_amount' => 0,
                    'coupon_amount' => 0,
                    'wallet_amount' => 0,
                    'total_amount' => 0,
                    'tax_percentage' => $meal->tax_percentage ?? 0,
                ]
            );

            $existingItem = $cart->items()->where('meal_id', $mealId)->first();

            $effectivePrice = (float) $meal->effective_price;
            $discountAmount = 0.0;
            if ($meal->offer_price !== null && (float) $meal->offer_price > 0 && (float) $meal->offer_price < (float) $meal->price) {
                $discountAmount = ((float) $meal->price - $effectivePrice) * $quantity;
            }

            if ($existingItem) {
                $newQty = $existingItem->quantity + $quantity;
                $newDiscount = $discountAmount + ($existingItem->discount_amount);
                $existingItem->update([
                    'quantity' => $newQty,
                    'unit_price' => $effectivePrice,
                    'discount_amount' => $newDiscount,
                    'total_price' => $effectivePrice * $newQty,
                    'special_instructions' => $specialInstructions ?? $existingItem->special_instructions,
                ]);
            } else {
                $cart->items()->create([
                    'meal_id' => $mealId,
                    'quantity' => $quantity,
                    'unit_price' => $effectivePrice,
                    'discount_amount' => $discountAmount,
                    'total_price' => $effectivePrice * $quantity,
                    'special_instructions' => $specialInstructions,
                ]);
            }

            return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
        });
    }

    public function updateItem(Customer $customer, int $cartItemId, int $quantity): Cart
    {
        return DB::transaction(function () use ($customer, $cartItemId, $quantity) {
            $cart = Cart::where('customer_id', $customer->id)->firstOrFail();
            $item = $cart->items()->findOrFail($cartItemId);

            if ($quantity < 1) {
                $item->delete();
                return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
            }

            $meal = $item->meal;
            if ($meal->status !== StatusEnum::Active) {
                throw new \Exception('This meal is currently unavailable.');
            }

            $effectivePrice = (float) $meal->effective_price;
            $discountAmount = 0.0;
            if ($meal->offer_price !== null && (float) $meal->offer_price > 0 && (float) $meal->offer_price < (float) $meal->price) {
                $discountAmount = ((float) $meal->price - $effectivePrice) * $quantity;
            }

            $item->update([
                'quantity' => $quantity,
                'unit_price' => $effectivePrice,
                'discount_amount' => $discountAmount,
                'total_price' => $effectivePrice * $quantity,
            ]);

            return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
        });
    }

    public function removeItem(Customer $customer, int $cartItemId): Cart
    {
        return DB::transaction(function () use ($customer, $cartItemId) {
            $cart = Cart::where('customer_id', $customer->id)->firstOrFail();
            $item = $cart->items()->findOrFail($cartItemId);
            $item->delete();

            if ($cart->items()->count() === 0) {
                $cart->delete();
                return $this->emptyCartResponse();
            }

            return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
        });
    }

    public function clearCart(Customer $customer): void
    {
        Cart::where('customer_id', $customer->id)->delete();
    }

    public function getCartCount(Customer $customer): int
    {
        $cart = Cart::where('customer_id', $customer->id)->first();
        return $cart ? $cart->itemCount() : 0;
    }

    public function applyCoupon(Customer $customer, string $couponCode): Cart
    {
        return DB::transaction(function () use ($customer, $couponCode) {
            $cart = Cart::where('customer_id', $customer->id)->firstOrFail();

            if ($cart->items()->count() === 0) {
                throw new \Exception('Cannot apply coupon to an empty cart.');
            }

            $subtotal = (float) $cart->subtotal;

            if (class_exists(\App\Models\Coupon::class)) {
                $coupon = \App\Models\Coupon::where('code', $couponCode)
                    ->where('status', StatusEnum::Active)
                    ->first();

                if (!$coupon) {
                    throw new \Exception('Invalid coupon code.');
                }

                if ($coupon->expires_at && $coupon->expires_at->isPast()) {
                    throw new \Exception('This coupon has expired.');
                }

                if ($coupon->min_order_amount && $subtotal < (float) $coupon->min_order_amount) {
                    throw new \Exception('Minimum order of ₹' . number_format((float) $coupon->min_order_amount, 2) . ' required for this coupon.');
                }

                $couponDiscount = 0.0;
                if ($coupon->type === 'percentage') {
                    $couponDiscount = $subtotal * ((float) $coupon->value / 100);
                    if ($coupon->max_discount && $couponDiscount > (float) $coupon->max_discount) {
                        $couponDiscount = (float) $coupon->max_discount;
                    }
                } else {
                    $couponDiscount = (float) $coupon->value;
                }

                $cart->update([
                    'coupon_code' => strtoupper($couponCode),
                    'coupon_amount' => $couponDiscount,
                ]);
            } else {
                $cart->update([
                    'coupon_code' => strtoupper($couponCode),
                    'coupon_amount' => 0,
                ]);
            }

            return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
        });
    }

    public function removeCoupon(Customer $customer): Cart
    {
        $cart = Cart::where('customer_id', $customer->id)->firstOrFail();
        $cart->update(['coupon_code' => null, 'coupon_amount' => 0]);

        return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
    }

    public function applyWallet(Customer $customer, ?float $amount = null): Cart
    {
        return DB::transaction(function () use ($customer, $amount) {
            $cart = Cart::where('customer_id', $customer->id)->firstOrFail();
            $walletBalance = (float) $customer->wallet_balance;

            if ($walletBalance <= 0) {
                throw new \Exception('Insufficient wallet balance.');
            }

            $preTotal = $this->calculatePreTotal($cart);

            $walletToUse = $amount ?? min($walletBalance, $preTotal);
            $walletToUse = min($walletToUse, $preTotal);

            if ($walletToUse <= 0) {
                throw new \Exception('No amount to apply wallet balance to.');
            }

            $cart->update(['wallet_amount' => $walletToUse]);

            return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
        });
    }

    public function removeWallet(Customer $customer): Cart
    {
        $cart = Cart::where('customer_id', $customer->id)->firstOrFail();
        $cart->update(['wallet_amount' => 0]);

        return $this->recalculateCart($cart->fresh(['items.meal.category', 'items.meal.mealType']));
    }

    public function recalculateCart(Cart $cart): Cart
    {
        $subtotal = 0.0;
        $totalDiscount = 0.0;
        $taxableAmount = 0.0;

        foreach ($cart->items as $item) {
            $itemTotal = (float) $item->total_price;
            $itemDiscount = (float) $item->discount_amount;
            $subtotal += $itemTotal + $itemDiscount;
            $totalDiscount += $itemDiscount;

            if ($item->meal && $item->meal->tax_percentage > 0) {
                $taxableAmount += $itemTotal;
            }
        }

        $taxRate = 0.0;
        if ($cart->items->count() > 0) {
            $firstMeal = $cart->items->first()->meal;
            $taxRate = $firstMeal ? (float) $firstMeal->tax_percentage : 0;
        }

        $taxAmount = $taxRate > 0 ? round($taxableAmount * ($taxRate / 100), 2) : 0;
        $deliveryCharge = (float) $cart->delivery_charge;
        $couponAmount = (float) $cart->coupon_amount;
        $walletAmount = (float) $cart->wallet_amount;

        $total = $subtotal + $taxAmount + $deliveryCharge - $totalDiscount - $couponAmount - $walletAmount;
        $total = max(0, $total);

        $cart->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'tax_percentage' => $taxRate,
            'discount_amount' => $totalDiscount,
            'total_amount' => $total,
        ]);

        return $cart->fresh(['items.meal.category', 'items.meal.mealType']);
    }

    private function calculatePreTotal(Cart $cart): float
    {
        $subtotal = (float) $cart->subtotal;
        $taxAmount = (float) $cart->tax_amount;
        $deliveryCharge = (float) $cart->delivery_charge;
        $totalDiscount = (float) $cart->discount_amount;
        $couponAmount = (float) $cart->coupon_amount;

        return max(0, $subtotal + $taxAmount + $deliveryCharge - $totalDiscount - $couponAmount);
    }

    private function emptyCartResponse(): Cart
    {
        $cart = new Cart([
            'customer_id' => 0,
            'subtotal' => 0,
            'tax_amount' => 0,
            'delivery_charge' => 0,
            'discount_amount' => 0,
            'coupon_amount' => 0,
            'wallet_amount' => 0,
            'total_amount' => 0,
        ]);
        $cart->setRelation('items', collect());

        return $cart;
    }
}
