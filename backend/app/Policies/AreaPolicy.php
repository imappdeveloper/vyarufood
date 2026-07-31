<?php
declare(strict_types=1);
namespace App\Policies;

use App\Support\BasePolicy;
use App\Models\Master\Area;

class AreaPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('area.view');
    }

    public function view($user, Area $area): bool
    {
        return $user->can('area.view');
    }

    public function create($user): bool
    {
        return $user->can('area.create');
    }

    public function update($user, Area $area): bool
    {
        return $user->can('area.update');
    }

    public function delete($user, Area $area): bool
    {
        if ($area->is_default) {
            return false;
        }

        return $user->can('area.delete');
    }

    public function restore($user, Area $area): bool
    {
        return $user->can('area.restore');
    }

    public function forceDelete($user, Area $area): bool
    {
        return $user->can('area.delete');
    }

    public function setStatus($user, Area $area): bool
    {
        return $user->can('area.update');
    }

    public function setDefault($user, Area $area): bool
    {
        return $user->can('area.update');
    }

    public function setServiceable($user, Area $area): bool
    {
        return $user->can('area.update');
    }

    public function import($user): bool
    {
        return $user->can('area.import');
    }

    public function export($user): bool
    {
        return $user->can('area.export');
    }
}
