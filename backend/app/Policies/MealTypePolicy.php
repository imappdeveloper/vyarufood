<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\MealType;

class MealTypePolicy
{
    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, MealType $mealType): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, MealType $mealType): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, MealType $mealType): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, MealType $mealType): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, MealType $mealType): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function setDefault($user, MealType $mealType): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
