<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\KitchenWorkingDay;

class KitchenWorkingDayPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, KitchenWorkingDay $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, KitchenWorkingDay $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, KitchenWorkingDay $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
