<?php

declare(strict_types=1);

namespace App\Events\CustomerSubscription;

use App\Models\CustomerSubscription;
use Illuminate\Foundation\Events\Dispatchable;

class CustomerSubscriptionCancelled
{
    use Dispatchable;

    public function __construct(
        public CustomerSubscription $subscription,
        public ?string $reason = null,
        public float $refundAmount = 0,
    ) {}
}
