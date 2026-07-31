<?php
declare(strict_types=1);
namespace App\Policies;

use App\Models\Auth\Admin;
use App\Models\Master\DeliverySlot;
use App\Services\DeliveryZone\DeliverySlotServiceInterface;
use App\Support\BasePolicy;
use Illuminate\Foundation\Auth\User as Authenticatable;

class DeliverySlotPolicy extends BasePolicy
{
    public function __construct(
        protected DeliverySlotServiceInterface $deliverySlotService
    ) {}

    public function viewAny($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function view($user, DeliverySlot $deliverySlot): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function create($user): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function update($user, DeliverySlot $deliverySlot): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function delete($user, DeliverySlot $deliverySlot): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function restore($user, DeliverySlot $deliverySlot): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }

    public function forceDelete($user, DeliverySlot $deliverySlot): bool
    {
        return $user instanceof Admin && $user->can('access_admin_panel');
    }
}
