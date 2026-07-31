<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Supplier;

class SupplierPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return true;
    }

    public function view($user, Supplier $supplier): bool
    {
        return true;
    }

    public function create($user): bool
    {
        return true;
    }

    public function update($user, Supplier $supplier): bool
    {
        return true;
    }

    public function delete($user, Supplier $supplier): bool
    {
        return true;
    }

    public function restore($user, Supplier $supplier): bool
    {
        return true;
    }

    public function forceDelete($user, Supplier $supplier): bool
    {
        return true;
    }

    public function changeStatus($user, Supplier $supplier): bool
    {
        return true;
    }

    public function blacklist($user, Supplier $supplier): bool
    {
        return true;
    }
}
