<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Repositories\Auth\RoleRepositoryInterface;
use App\Support\BaseService;
use App\Exceptions\BusinessException;
use Spatie\Permission\Models\Role;

class RoleService extends BaseService implements RoleServiceInterface
{
    protected string $moduleName = 'roles';

    public function __construct(
        protected RoleRepositoryInterface $roleRepo,
    ) {}

    public function list(int $perPage = 15, string $sort = 'sort_order', string $order = 'asc'): mixed
    {
        return $this->roleRepo->paginate($perPage, $sort, $order);
    }

    public function getAllRoles(): mixed
    {
        return $this->roleRepo->all();
    }

    public function findById(int $id): Role
    {
        $role = $this->roleRepo->findOrFail($id);
        return $role->load('permissions');
    }

    public function create(array $data): Role
    {
        if ($this->roleRepo->nameExists($data['name'])) {
            throw new BusinessException('Role name already exists.', 422);
        }

        $data['guard_name'] = 'admin';
        $role = $this->roleRepo->create($data);

        if (!empty($data['permission_ids'])) {
            $this->roleRepo->syncPermissions($role, $data['permission_ids']);
        }

        $this->logInfo('Role created', ['role_id' => $role->id, 'name' => $role->name]);
        return $role->load('permissions');
    }

    public function update(Role $role, array $data): Role
    {
        if (isset($data['name']) && $this->roleRepo->nameExists($data['name'], $role->id)) {
            throw new BusinessException('Role name already exists.', 422);
        }

        $role = $this->roleRepo->update($role, $data);

        if (isset($data['permission_ids'])) {
            $this->roleRepo->syncPermissions($role, $data['permission_ids']);
        }

        $this->logInfo('Role updated', ['role_id' => $role->id]);
        return $role->fresh()->load('permissions');
    }

    public function delete(Role $role): void
    {
        if ($role->is_default) {
            throw new BusinessException('Cannot delete a default role.', 422);
        }

        if ($role->admins()->count() > 0) {
            throw new BusinessException('Cannot delete role with assigned users. Remove users first.', 422);
        }

        $this->roleRepo->delete($role);
        $this->logInfo('Role deleted', ['role_id' => $role->id, 'name' => $role->name]);
    }

    public function cloneRole(Role $role, string $newName): Role
    {
        if ($this->roleRepo->nameExists($newName)) {
            throw new BusinessException('Role name already exists.', 422);
        }

        $cloned = $this->roleRepo->cloneRole($role, $newName);
        $this->logInfo('Role cloned', ['original_id' => $role->id, 'cloned_id' => $cloned->id]);
        return $cloned->load('permissions');
    }

    public function assignPermissions(Role $role, array $permissionIds): Role
    {
        $this->roleRepo->syncPermissions($role, $permissionIds);
        $this->logInfo('Permissions assigned to role', ['role_id' => $role->id, 'count' => count($permissionIds)]);
        return $role->fresh()->load('permissions');
    }

    public function removePermissions(Role $role, array $permissionIds): Role
    {
        $role->revokePermissionTo($permissionIds);
        $this->logInfo('Permissions removed from role', ['role_id' => $role->id, 'count' => count($permissionIds)]);
        return $role->fresh()->load('permissions');
    }

    public function nameExists(string $name, ?int $ignoreId = null): bool
    {
        return $this->roleRepo->nameExists($name, $ignoreId);
    }
}
