<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Customer;

class CustomerPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function export($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function import($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function block($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function unblock($user, Customer $customer): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
