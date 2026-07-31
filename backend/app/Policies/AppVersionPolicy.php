<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\AppVersion;

class AppVersionPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('version.manage');
    }

    public function view($user, AppVersion $appVersion): bool
    {
        return $user->can('version.manage');
    }

    public function create($user): bool
    {
        return $user->can('version.manage');
    }

    public function update($user, AppVersion $appVersion): bool
    {
        return $user->can('version.manage');
    }

    public function delete($user, AppVersion $appVersion): bool
    {
        return $user->can('version.manage');
    }

    public function setStatus($user, AppVersion $appVersion): bool
    {
        return $user->can('version.manage');
    }
}
