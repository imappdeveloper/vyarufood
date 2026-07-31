<?php
declare(strict_types=1);
namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Master\DeliveryZone;
use App\Services\DeliveryZone\DeliveryZoneServiceInterface;
use App\Support\BasePolicy;
use Illuminate\Foundation\Auth\User as Authenticatable;

class DeliveryZonePolicy extends BasePolicy
{
    public function __construct(
        protected DeliveryZoneServiceInterface $deliveryZoneService
    ) {}

    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, DeliveryZone $deliveryZone): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, DeliveryZone $deliveryZone): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, DeliveryZone $deliveryZone): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, DeliveryZone $deliveryZone): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, DeliveryZone $deliveryZone): bool
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

    public function setDefault($user, DeliveryZone $deliveryZone): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
