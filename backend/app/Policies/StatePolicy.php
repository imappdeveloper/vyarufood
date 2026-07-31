<?php
declare(strict_types=1);
namespace App\Policies;
use App\Support\BasePolicy;
use App\Models\Master\State;

class StatePolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('state.view');
    }

    public function view($user, State $state): bool
    {
        return $user->can('state.view');
    }

    public function create($user): bool
    {
        return $user->can('state.create');
    }

    public function update($user, State $state): bool
    {
        return $user->can('state.update');
    }

    public function delete($user, State $state): bool
    {
        return $user->can('state.delete');
    }

    public function restore($user, State $state): bool
    {
        return $user->can('state.restore');
    }

    public function forceDelete($user, State $state): bool
    {
        return $user->can('state.delete');
    }

    public function setStatus($user, State $state): bool
    {
        return $user->can('state.update');
    }

    public function setDefault($user, State $state): bool
    {
        return $user->can('state.update');
    }

    public function import($user): bool
    {
        return $user->can('state.import');
    }

    public function export($user): bool
    {
        return $user->can('state.export');
    }
}
