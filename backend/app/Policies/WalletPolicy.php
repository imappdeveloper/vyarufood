<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Wallet;

class WalletPolicy
{
    public function viewAny(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view(Admin $user, Wallet $wallet): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function adjust(Admin $user, Wallet $wallet): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
