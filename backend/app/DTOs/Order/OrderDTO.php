<?php

declare(strict_types=1);

namespace App\DTOs\Order;

final class OrderDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $orderNumber = null,
        public readonly string $orderType = 'subscription',
        public readonly ?int $customerId = null,
        public readonly ?int $subscriptionId = null,
        public readonly ?int $kitchenId = null,
        public readonly ?int $addressId = null,
        public readonly ?int $deliveryZoneId = null,
        public readonly ?string $orderDate = null,
        public readonly ?string $deliveryDate = null,
        public readonly ?int $mealCategoryId = null,
        public readonly ?int $mealTypeId = null,
        public readonly ?int $mealId = null,
        public readonly int $quantity = 1,
        public readonly float $unitPrice = 0,
        public readonly float $discountAmount = 0,
        public readonly float $couponAmount = 0,
        public readonly float $taxPercentage = 0,
        public readonly float $deliveryCharge = 0,
        public readonly ?string $deliverySlot = null,
        public readonly ?string $deliveryInstruction = null,
        public readonly float $walletAmount = 0,
        public readonly int $rewardPointsUsed = 0,
        public readonly ?string $paymentMethod = null,
        public readonly ?string $notes = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            orderNumber: $data['order_number'] ?? null,
            orderType: $data['order_type'] ?? 'subscription',
            customerId: isset($data['customer_id']) ? (int) $data['customer_id'] : null,
            subscriptionId: isset($data['subscription_id']) ? (int) $data['subscription_id'] : null,
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : null,
            addressId: isset($data['address_id']) ? (int) $data['address_id'] : null,
            deliveryZoneId: isset($data['delivery_zone_id']) ? (int) $data['delivery_zone_id'] : null,
            orderDate: $data['order_date'] ?? null,
            deliveryDate: $data['delivery_date'] ?? null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            mealTypeId: isset($data['meal_type_id']) ? (int) $data['meal_type_id'] : null,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            quantity: isset($data['quantity']) ? (int) $data['quantity'] : 1,
            unitPrice: isset($data['unit_price']) ? (float) $data['unit_price'] : 0,
            discountAmount: isset($data['discount_amount']) ? (float) $data['discount_amount'] : 0,
            couponAmount: isset($data['coupon_amount']) ? (float) $data['coupon_amount'] : 0,
            taxPercentage: isset($data['tax_percentage']) ? (float) $data['tax_percentage'] : 0,
            deliveryCharge: isset($data['delivery_charge']) ? (float) $data['delivery_charge'] : 0,
            deliverySlot: $data['delivery_slot'] ?? null,
            deliveryInstruction: $data['delivery_instruction'] ?? null,
            walletAmount: isset($data['wallet_amount']) ? (float) $data['wallet_amount'] : 0,
            rewardPointsUsed: isset($data['reward_points_used']) ? (int) $data['reward_points_used'] : 0,
            paymentMethod: $data['payment_method'] ?? null,
            notes: $data['notes'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array { return get_object_vars($this); }
}
