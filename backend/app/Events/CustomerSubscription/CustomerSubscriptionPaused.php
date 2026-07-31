<?php

declare(strict_types=1);

namespace App\Events\CustomerSubscription;

use App\Models\CustomerSubscription;
use Illuminate\Foundation\Events\Dispatchable;

class CustomerSubscriptionPaused
{
    use Dispatchable;

    public function __construct(
        public CustomerSubscription $subscription,
        public string $pauseStart,
        public string $pauseEnd,
    ) {}
}
