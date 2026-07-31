<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\PaymentTransaction;

class PaymentTransactionPolicy
{
    public function viewAny(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view(Admin $user, PaymentTransaction $paymentTransaction): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create(Admin $user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update(Admin $user, PaymentTransaction $paymentTransaction): bool
    {
        return false;
    }

    public function delete(Admin $user, PaymentTransaction $paymentTransaction): bool
    {
        return false;
    }
}
