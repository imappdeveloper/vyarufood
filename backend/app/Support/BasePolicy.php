<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Auth\Access\HandlesAuthorization;

abstract class BasePolicy
{
    use HandlesAuthorization;

    public function viewAny($user): bool
    {
        return $user->can('view_any_' . $this->getModuleName());
    }

    public function view($user, $model): bool
    {
        return $user->can('view_' . $this->getModuleName());
    }

    public function create($user): bool
    {
        return $user->can('create_' . $this->getModuleName());
    }

    public function update($user, $model): bool
    {
        return $user->can('update_' . $this->getModuleName());
    }

    public function delete($user, $model): bool
    {
        return $user->can('delete_' . $this->getModuleName());
    }

    public function restore($user, $model): bool
    {
        return $user->can('restore_' . $this->getModuleName());
    }

    public function forceDelete($user, $model): bool
    {
        return $user->can('force_delete_' . $this->getModuleName());
    }

    protected function getModuleName(): string
    {
        $class = class_basename(static::class);
        return strtolower(str_replace('Policy', '', $class));
    }
}
