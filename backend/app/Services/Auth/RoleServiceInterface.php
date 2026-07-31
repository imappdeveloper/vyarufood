<?php

declare(strict_types=1);

namespace App\Services\Auth;

use Spatie\Permission\Models\Role;

interface RoleServiceInterface
{
    public function list(int $perPage = 15, string $sort = 'sort_order', string $order = 'asc'): mixed;
    public function getAllRoles(): mixed;
    public function findById(int $id): Role;
    public function create(array $data): Role;
    public function update(Role $role, array $data): Role;
    public function delete(Role $role): void;
    public function cloneRole(Role $role, string $newName): Role;
    public function assignPermissions(Role $role, array $permissionIds): Role;
    public function removePermissions(Role $role, array $permissionIds): Role;
    public function nameExists(string $name, ?int $ignoreId = null): bool;
}
