<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\CustomerMealSelection;

class CustomerMealSelectionPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, CustomerMealSelection $selection): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, CustomerMealSelection $selection): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, CustomerMealSelection $selection): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, CustomerMealSelection $selection): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, CustomerMealSelection $selection): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
