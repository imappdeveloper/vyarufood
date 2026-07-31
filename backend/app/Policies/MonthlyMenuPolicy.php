<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\MonthlyMenu;

class MonthlyMenuPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function publish($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function approve($user, MonthlyMenu $monthlyMenu): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
