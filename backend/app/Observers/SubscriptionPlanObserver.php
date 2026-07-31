<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\SubscriptionPlan;
use App\Events\SubscriptionPlan\SubscriptionPlanCreated;
use App\Events\SubscriptionPlan\SubscriptionPlanUpdated;
use App\Events\SubscriptionPlan\SubscriptionPlanDeleted;
use App\Events\SubscriptionPlan\SubscriptionPlanRestored;

class SubscriptionPlanObserver
{
    public function created(SubscriptionPlan $subscriptionPlan): void
    {
        event(new SubscriptionPlanCreated($subscriptionPlan));
    }

    public function updated(SubscriptionPlan $subscriptionPlan): void
    {
        event(new SubscriptionPlanUpdated($subscriptionPlan));
    }

    public function deleted(SubscriptionPlan $subscriptionPlan): void
    {
        event(new SubscriptionPlanDeleted($subscriptionPlan));
    }

    public function restored(SubscriptionPlan $subscriptionPlan): void
    {
        event(new SubscriptionPlanRestored($subscriptionPlan));
    }
}
