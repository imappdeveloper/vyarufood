<?php

declare(strict_types=1);

namespace App\Events\CustomerSubscription;

use App\Models\CustomerSubscription;
use App\Models\SubscriptionRenewHistory;
use Illuminate\Foundation\Events\Dispatchable;

class CustomerSubscriptionRenewed
{
    use Dispatchable;

    public function __construct(
        public CustomerSubscription $subscription,
        public SubscriptionRenewHistory $renewHistory,
    ) {}
}
