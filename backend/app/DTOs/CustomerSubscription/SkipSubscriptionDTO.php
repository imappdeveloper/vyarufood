<?php

declare(strict_types=1);

namespace App\DTOs\CustomerSubscription;

final class SkipSubscriptionDTO
{
    public function __construct(
        public readonly int $subscriptionId,
        public readonly string $skipType,
        public readonly string $skipDate,
        public readonly ?int $mealId = null,
        public readonly ?string $reason = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            subscriptionId: (int) $data['subscription_id'],
            skipType: $data['skip_type'],
            skipDate: $data['skip_date'],
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            reason: $data['reason'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
