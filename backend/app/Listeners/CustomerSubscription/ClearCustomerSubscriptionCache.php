<?php

declare(strict_types=1);

namespace App\Listeners\CustomerSubscription;

use App\Support\CacheManager;
use Illuminate\Support\Facades\Log;

class ClearCustomerSubscriptionCache
{
    public function handle(object $event): void
    {
        Log::info('Clearing customer subscription cache for event: ' . class_basename($event));
        CacheManager::flush('customer_subscription');
    }
}
