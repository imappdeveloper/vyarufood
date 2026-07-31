<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Order;

class OrderPolicy
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

    public function view(Admin $user, Order $order): bool
    {
        return true;
    }

    public function create(Admin $user): bool
    {
        return true;
    }

    public function update(Admin $user, Order $order): bool
    {
        return true;
    }

    public function delete(Admin $user, Order $order): bool
    {
        return true;
    }

    public function restore(Admin $user, Order $order): bool
    {
        return true;
    }

    public function cancel(Admin $user, Order $order): bool
    {
        return true;
    }

    public function refund(Admin $user, Order $order): bool
    {
        return true;
    }

    public function manageStatus(Admin $user, Order $order): bool
    {
        return true;
    }
}
