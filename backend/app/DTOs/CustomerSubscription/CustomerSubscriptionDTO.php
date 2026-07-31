<?php

declare(strict_types=1);

namespace App\DTOs\CustomerSubscription;

final class CustomerSubscriptionDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $subscriptionNumber = null,
        public readonly ?int $customerId = null,
        public readonly ?int $subscriptionPlanId = null,
        public readonly ?int $kitchenId = null,
        public readonly ?string $startDate = null,
        public readonly ?string $endDate = null,
        public readonly ?string $activationDate = null,
        public readonly string $billingCycle = 'monthly',
        public readonly ?int $mealCategoryId = null,
        public readonly string $subscriptionStatus = 'pending',
        public readonly string $paymentStatus = 'pending',
        public readonly float $walletAdjustment = 0,
        public readonly int $remainingMeals = 0,
        public readonly int $consumedMeals = 0,
        public readonly int $skippedMeals = 0,
        public readonly int $pausedDays = 0,
        public readonly ?string $pauseStart = null,
        public readonly ?string $pauseEnd = null,
        public readonly ?string $nextDeliveryDate = null,
        public readonly ?string $deliverySlot = null,
        public readonly bool $autoRenew = false,
        public readonly ?string $renewalDate = null,
        public readonly ?string $cancellationDate = null,
        public readonly ?string $cancellationReason = null,
        public readonly float $refundAmount = 0,
        public readonly ?string $remarks = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            subscriptionNumber: $data['subscription_number'] ?? null,
            customerId: isset($data['customer_id']) ? (int) $data['customer_id'] : null,
            subscriptionPlanId: isset($data['subscription_plan_id']) ? (int) $data['subscription_plan_id'] : null,
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : null,
            startDate: $data['start_date'] ?? null,
            endDate: $data['end_date'] ?? null,
            activationDate: $data['activation_date'] ?? null,
            billingCycle: $data['billing_cycle'] ?? 'monthly',
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            subscriptionStatus: $data['subscription_status'] ?? 'pending',
            paymentStatus: $data['payment_status'] ?? 'pending',
            walletAdjustment: isset($data['wallet_adjustment']) ? (float) $data['wallet_adjustment'] : 0,
            remainingMeals: isset($data['remaining_meals']) ? (int) $data['remaining_meals'] : 0,
            consumedMeals: isset($data['consumed_meals']) ? (int) $data['consumed_meals'] : 0,
            skippedMeals: isset($data['skipped_meals']) ? (int) $data['skipped_meals'] : 0,
            pausedDays: isset($data['paused_days']) ? (int) $data['paused_days'] : 0,
            pauseStart: $data['pause_start'] ?? null,
            pauseEnd: $data['pause_end'] ?? null,
            nextDeliveryDate: $data['next_delivery_date'] ?? null,
            deliverySlot: $data['delivery_slot'] ?? null,
            autoRenew: (bool) ($data['auto_renew'] ?? false),
            renewalDate: $data['renewal_date'] ?? null,
            cancellationDate: $data['cancellation_date'] ?? null,
            cancellationReason: $data['cancellation_reason'] ?? null,
            refundAmount: isset($data['refund_amount']) ? (float) $data['refund_amount'] : 0,
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
        );
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
