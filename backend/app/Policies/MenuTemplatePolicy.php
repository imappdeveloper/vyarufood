<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\MenuTemplate;

class MenuTemplatePolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, MenuTemplate $menuTemplate): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, MenuTemplate $menuTemplate): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, MenuTemplate $menuTemplate): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, MenuTemplate $menuTemplate): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, MenuTemplate $menuTemplate): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
