<?php

declare(strict_types=1);

namespace App\Events\SubscriptionPlan;

use App\Models\SubscriptionPlan;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscriptionPlanUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(public SubscriptionPlan $plan) {}
}
