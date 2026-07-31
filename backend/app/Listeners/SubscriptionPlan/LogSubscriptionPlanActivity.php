<?php

declare(strict_types=1);

namespace App\Listeners\SubscriptionPlan;

use Illuminate\Support\Facades\Log;

class LogSubscriptionPlanActivity
{
    public function handle(object $event): void
    {
        Log::info('Subscription plan event: ' . class_basename($event), [
            'plan_id' => $event->plan->id ?? null,
        ]);
    }
}
