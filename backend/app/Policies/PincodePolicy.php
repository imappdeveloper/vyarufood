<?php
declare(strict_types=1);
namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Master\Pincode;
use App\Services\Pincode\PincodeServiceInterface;
use App\Support\BasePolicy;
use Illuminate\Foundation\Auth\User as Authenticatable;

class PincodePolicy extends BasePolicy
{
    public function __construct(
        protected PincodeServiceInterface $pincodeService
    ) {}

    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, Pincode $pincode): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, Pincode $pincode): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, Pincode $pincode): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, Pincode $pincode): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, Pincode $pincode): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function export($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function import($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
