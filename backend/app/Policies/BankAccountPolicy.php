<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Admin;
use App\Models\BankAccount;

class BankAccountPolicy
{
    public function viewAny(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view(Admin $user, BankAccount $bankAccount): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update(Admin $user, BankAccount $bankAccount): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete(Admin $user, BankAccount $bankAccount): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore(Admin $user, BankAccount $bankAccount): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete(Admin $user, BankAccount $bankAccount): bool
    {
        return false;
    }
}
