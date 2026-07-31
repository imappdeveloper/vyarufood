<?php
declare(strict_types=1);
namespace App\Policies;
use App\Support\BasePolicy;
use App\Models\Master\City;

class CityPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('city.view');
    }

    public function view($user, City $city): bool
    {
        return $user->can('city.view');
    }

    public function create($user): bool
    {
        return $user->can('city.create');
    }

    public function update($user, City $city): bool
    {
        return $user->can('city.update');
    }

    public function delete($user, City $city): bool
    {
        return $user->can('city.delete');
    }

    public function restore($user, City $city): bool
    {
        return $user->can('city.restore');
    }

    public function forceDelete($user, City $city): bool
    {
        return $user->can('city.delete');
    }

    public function setStatus($user, City $city): bool
    {
        return $user->can('city.update');
    }

    public function setDefault($user, City $city): bool
    {
        return $user->can('city.update');
    }

    public function import($user): bool
    {
        return $user->can('city.import');
    }

    public function export($user): bool
    {
        return $user->can('city.export');
    }
}
