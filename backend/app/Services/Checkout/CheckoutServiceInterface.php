<?php

declare(strict_types=1);

namespace App\Services\Checkout;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;

interface CheckoutServiceInterface
{
    public function getCheckoutSummary(Customer $customer): array;

    public function placeOrder(Customer $customer, array $data): Order;

    public function calculateDeliveryCharge(?int $deliveryZoneId, float $subtotal): float;
}
