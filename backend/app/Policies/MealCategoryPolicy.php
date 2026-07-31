<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\MealCategory;

class MealCategoryPolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, MealCategory $mealCategory): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, MealCategory $mealCategory): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, MealCategory $mealCategory): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, MealCategory $mealCategory): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, MealCategory $mealCategory): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function setDefault($user, MealCategory $mealCategory): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
