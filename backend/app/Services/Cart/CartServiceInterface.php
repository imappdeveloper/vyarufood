<?php

declare(strict_types=1);

namespace App\Services\Cart;

use App\Models\Cart;
use App\Models\Customer;

interface CartServiceInterface
{
    public function getCart(Customer $customer): ?Cart;

    public function addItem(Customer $customer, int $mealId, int $quantity = 1, ?string $specialInstructions = null): Cart;

    public function updateItem(Customer $customer, int $cartItemId, int $quantity): Cart;

    public function removeItem(Customer $customer, int $cartItemId): Cart;

    public function clearCart(Customer $customer): void;

    public function getCartCount(Customer $customer): int;

    public function applyCoupon(Customer $customer, string $couponCode): Cart;

    public function removeCoupon(Customer $customer): Cart;

    public function applyWallet(Customer $customer, ?float $amount = null): Cart;

    public function removeWallet(Customer $customer): Cart;

    public function recalculateCart(Cart $cart): Cart;
}
