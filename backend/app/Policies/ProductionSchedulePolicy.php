<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\ProductionSchedule;

class ProductionSchedulePolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, ProductionSchedule $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, ProductionSchedule $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, ProductionSchedule $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
