<?php

declare(strict_types=1);

namespace App\DTOs\CustomerSubscription;

final class CancelSubscriptionDTO
{
    public function __construct(
        public readonly int $subscriptionId,
        public readonly ?string $reason = null,
        public readonly bool $processRefund = false,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            subscriptionId: (int) $data['subscription_id'],
            reason: $data['reason'] ?? null,
            processRefund: (bool) ($data['process_refund'] ?? false),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
