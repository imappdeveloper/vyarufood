<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\WeeklyMenuItem;

class WeeklyMenuItemPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, WeeklyMenuItem $weeklyMenuItem): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, WeeklyMenuItem $weeklyMenuItem): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, WeeklyMenuItem $weeklyMenuItem): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, WeeklyMenuItem $weeklyMenuItem): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, WeeklyMenuItem $weeklyMenuItem): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
