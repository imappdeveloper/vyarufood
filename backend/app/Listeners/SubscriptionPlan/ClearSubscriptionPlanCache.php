<?php

declare(strict_types=1);

namespace App\Listeners\SubscriptionPlan;

use App\Support\CacheManager;
use Illuminate\Support\Facades\Log;

class ClearSubscriptionPlanCache
{
    public function handle(object $event): void
    {
        Log::info('Subscription plan cache cleared', [
            'event' => class_basename($event),
            'plan_id' => $event->plan->id ?? null,
        ]);

        CacheManager::flush('subscription_plan');
    }
}
