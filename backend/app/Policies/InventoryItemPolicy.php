<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Auth\Admin;

class InventoryItemPolicy
{
    public function accessAdminPanel(Admin $admin): bool
    {
        return true;
    }
}
