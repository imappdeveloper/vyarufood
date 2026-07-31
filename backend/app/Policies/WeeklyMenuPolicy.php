<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\WeeklyMenu;

class WeeklyMenuPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function publish($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function unpublish($user, WeeklyMenu $weeklyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
