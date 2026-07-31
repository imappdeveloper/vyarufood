<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\CustomerSubscription;
use App\Events\CustomerSubscription\{CustomerSubscriptionCreated, CustomerSubscriptionUpdated, CustomerSubscriptionDeleted, CustomerSubscriptionStatusChanged};

class CustomerSubscriptionObserver
{
    public function created(CustomerSubscription $subscription): void
    {
        CustomerSubscriptionCreated::dispatch($subscription);
    }

    public function updated(CustomerSubscription $subscription): void
    {
        CustomerSubscriptionUpdated::dispatch($subscription);

        if ($subscription->wasChanged('subscription_status')) {
            CustomerSubscriptionStatusChanged::dispatch(
                $subscription,
                $subscription->getOriginal('subscription_status'),
                $subscription->subscription_status
            );
        }
    }

    public function deleted(CustomerSubscription $subscription): void
    {
        CustomerSubscriptionDeleted::dispatch($subscription);
    }
}
