<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Admin;

class ReportPolicy
{
    public function before(Admin $user, string $ability): ?bool
    {
        if ($user->can('access_admin_panel')) {
            return true;
        }

        return null;
    }

    public function viewAny(Admin $user): bool
    {
        return true;
    }

    public function view(Admin $user): bool
    {
        return true;
    }

    public function create(Admin $user): bool
    {
        return true;
    }

    public function update(Admin $user): bool
    {
        return true;
    }

    public function delete(Admin $user): bool
    {
        return true;
    }

    public function export(Admin $user): bool
    {
        return true;
    }

    public function schedule(Admin $user): bool
    {
        return true;
    }
}
