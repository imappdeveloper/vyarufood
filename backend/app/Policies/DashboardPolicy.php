<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;

class DashboardPolicy
{
    public function view(Admin $admin): bool
    {
        return true;
    }

    public function viewAnalytics(Admin $admin): bool
    {
        return true;
    }

    public function export(Admin $admin): bool
    {
        return true;
    }

    public function viewSystemHealth(Admin $admin): bool
    {
        return true;
    }
}
