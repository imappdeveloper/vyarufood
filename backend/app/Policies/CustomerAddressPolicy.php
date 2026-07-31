<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\CustomerAddress;

class CustomerAddressPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function setDefault($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function verify($user, CustomerAddress $address): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
