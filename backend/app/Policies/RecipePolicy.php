<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use Illuminate\Auth\Access\HandlesAuthorization;

class RecipePolicy
{
    use HandlesAuthorization;

    public function viewAny(Admin $admin): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }

    public function view(Admin $admin, $recipe): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }

    public function create(Admin $admin): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }

    public function update(Admin $admin, $recipe): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }

    public function delete(Admin $admin, $recipe): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }

    public function restore(Admin $admin, $recipe): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }

    public function forceDelete(Admin $admin, $recipe): bool
    {
        return $admin instanceof Admin && $admin->can('access_admin_panel');
    }
}
