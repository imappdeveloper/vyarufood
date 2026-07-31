<?php

declare(strict_types=1);

namespace App\DTOs\CustomerSubscription;

final class PauseSubscriptionDTO
{
    public function __construct(
        public readonly int $subscriptionId,
        public readonly string $pauseStart,
        public readonly string $pauseEnd,
        public readonly ?string $reason = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            subscriptionId: (int) $data['subscription_id'],
            pauseStart: $data['pause_start'],
            pauseEnd: $data['pause_end'],
            reason: $data['reason'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
