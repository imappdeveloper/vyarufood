<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\CustomerSubscription;

class CustomerSubscriptionPolicy
{
    public function before(Admin $user): ?bool
    {
        if ($user->can('access_admin_panel')) {
            return true;
        }
        return null;
    }

    public function viewAny(Admin $user): bool
    {
        return true;
    }

    public function view(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function create(Admin $user): bool
    {
        return true;
    }

    public function update(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function delete(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function restore(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function pause(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function resume(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function cancel(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }

    public function refund(Admin $user, CustomerSubscription $subscription): bool
    {
        return true;
    }
}
