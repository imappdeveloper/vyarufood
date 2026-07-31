<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\SystemSetting;

class SystemSettingPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('settings.view');
    }

    public function view($user, SystemSetting $systemSetting): bool
    {
        return $user->can('settings.view');
    }

    public function create($user): bool
    {
        return $user->can('settings.update');
    }

    public function update($user, SystemSetting $systemSetting): bool
    {
        return $user->can('settings.update');
    }

    public function delete($user, SystemSetting $systemSetting): bool
    {
        return $user->can('settings.update');
    }

    public function bulkUpdate($user): bool
    {
        return $user->can('settings.update');
    }
}
