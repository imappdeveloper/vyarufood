<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CmsPage;

class CmsPagePolicy extends BasePolicy
{
    public function viewAny($user): bool
    {
        return $user->can('cms.view');
    }

    public function view($user, CmsPage $cmsPage): bool
    {
        return $user->can('cms.view');
    }

    public function create($user): bool
    {
        return $user->can('cms.create');
    }

    public function update($user, CmsPage $cmsPage): bool
    {
        return $user->can('cms.update');
    }

    public function delete($user, CmsPage $cmsPage): bool
    {
        return $user->can('cms.delete');
    }

    public function publish($user, CmsPage $cmsPage): bool
    {
        return $user->can('cms.update');
    }

    public function archive($user, CmsPage $cmsPage): bool
    {
        return $user->can('cms.update');
    }
}
