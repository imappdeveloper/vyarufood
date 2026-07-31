<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\KitchenHoliday;

class KitchenHolidayPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, KitchenHoliday $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, KitchenHoliday $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, KitchenHoliday $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
