<?php

declare(strict_types=1);

namespace App\DTOs\CustomerSubscription;

final class UpgradeSubscriptionDTO
{
    public function __construct(
        public readonly int $subscriptionId,
        public readonly int $newPlanId,
        public readonly ?string $reason = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            subscriptionId: (int) $data['subscription_id'],
            newPlanId: (int) $data['new_plan_id'],
            reason: $data['reason'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
