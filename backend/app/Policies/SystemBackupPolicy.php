<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\SystemBackup;

class SystemBackupPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('backup.run');
    }

    public function view($user, SystemBackup $systemBackup): bool
    {
        return $user->can('backup.run');
    }

    public function create($user): bool
    {
        return $user->can('backup.run');
    }

    public function delete($user, SystemBackup $systemBackup): bool
    {
        return $user->can('backup.run');
    }

    public function restore($user, SystemBackup $systemBackup): bool
    {
        return $user->can('backup.restore');
    }
}
