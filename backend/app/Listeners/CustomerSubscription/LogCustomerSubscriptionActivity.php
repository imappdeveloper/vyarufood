<?php

declare(strict_types=1);

namespace App\Listeners\CustomerSubscription;

use Illuminate\Support\Facades\Log;

class LogCustomerSubscriptionActivity
{
    public function handle(object $event): void
    {
        Log::info('Customer subscription event: ' . class_basename($event), [
            'subscription_id' => $event->subscription->id ?? null,
            'subscription_number' => $event->subscription->subscription_number ?? null,
        ]);
    }
}
