<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\SubscriptionPlan;

class SubscriptionPlanPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin;
    }

    public function view($user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user instanceof Admin;
    }

    public function create($user): bool
    {
        return $user instanceof Admin;
    }

    public function update($user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user instanceof Admin;
    }

    public function delete($user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user instanceof Admin;
    }

    public function restore($user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user instanceof Admin;
    }

    public function forceDelete($user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user instanceof Admin;
    }
}
