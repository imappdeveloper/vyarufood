<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Admin;
use App\Models\Expense;

class ExpensePolicy
{
    public function viewAny(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view(Admin $user, Expense $expense): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update(Admin $user, Expense $expense): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete(Admin $user, Expense $expense): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function approve(Admin $user, Expense $expense): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
