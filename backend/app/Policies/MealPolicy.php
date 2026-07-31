<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Meal;

class MealPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, Meal $meal): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, Meal $meal): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, Meal $meal): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, Meal $meal): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, Meal $meal): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
