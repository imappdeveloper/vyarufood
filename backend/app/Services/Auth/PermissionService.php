<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Repositories\Auth\PermissionRepositoryInterface;
use App\Support\BaseService;

class PermissionService extends BaseService implements PermissionServiceInterface
{
    protected string $moduleName = 'permissions';

    public function __construct(
        protected PermissionRepositoryInterface $permissionRepo,
    ) {}

    public function all()
    {
        return $this->permissionRepo->all();
    }

    public function grouped(): array
    {
        return $this->permissionRepo->grouped();
    }

    public function getByGroup(string $group)
    {
        return $this->permissionRepo->getByGroup($group);
    }
}
