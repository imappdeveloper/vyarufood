<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Admin;

class FinancePolicy
{
    public function viewAny(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view(Admin $user, mixed $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update(Admin $user, mixed $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete(Admin $user, mixed $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore(Admin $user, mixed $model): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete(Admin $user, mixed $model): bool
    {
        return false;
    }
}
