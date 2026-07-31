<?php

declare(strict_types=1);

namespace App\Policies\Auth;

use App\Models\Auth\Admin;
use App\Support\BasePolicy;

class AdminPolicy extends BasePolicy
{
    public function viewAny(Admin $user): bool
    {
        return $user->can('view_admin_users');
    }

    public function view(Admin $user, Admin $admin): bool
    {
        return $user->can('view_admin_users') || $user->id === $admin->id;
    }

    public function create(Admin $user): bool
    {
        return $user->can('create_admin_users');
    }

    public function update(Admin $user, Admin $admin): bool
    {
        return $user->can('update_admin_users') || $user->id === $admin->id;
    }

    public function delete(Admin $user, Admin $admin): bool
    {
        if ($admin->roles->contains('name', 'super_admin')) {
            return false;
        }
        return $user->can('delete_admin_users');
    }
}
