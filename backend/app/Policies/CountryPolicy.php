<?php
declare(strict_types=1);
namespace App\Policies;
use App\Support\BasePolicy;
use App\Models\Master\Country;

class CountryPolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('country.view');
    }

    public function view($user, Country $country): bool
    {
        return $user->can('country.view');
    }

    public function create($user): bool
    {
        return $user->can('country.create');
    }

    public function update($user, Country $country): bool
    {
        return $user->can('country.update');
    }

    public function delete($user, Country $country): bool
    {
        return $user->can('country.delete');
    }

    public function restore($user, Country $country): bool
    {
        return $user->can('country.restore');
    }

    public function forceDelete($user, Country $country): bool
    {
        return $user->can('country.delete');
    }

    public function setStatus($user, Country $country): bool
    {
        return $user->can('country.update');
    }

    public function setDefault($user, Country $country): bool
    {
        return $user->can('country.update');
    }

    public function import($user): bool
    {
        return $user->can('country.import');
    }

    public function export($user): bool
    {
        return $user->can('country.export');
    }
}
