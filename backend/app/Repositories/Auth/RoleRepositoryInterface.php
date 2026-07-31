<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use Spatie\Permission\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RoleRepositoryInterface
{
    public function find(int $id): ?Role;
    public function findOrFail(int $id): Role;
    public function findByName(string $name): ?Role;
    public function create(array $data): Role;
    public function update(Role $role, array $data): Role;
    public function delete(Role $role): bool;
    public function paginate(int $perPage = 15, string $sort = 'sort_order', string $order = 'asc'): LengthAwarePaginator;
    public function all(): \Illuminate\Database\Eloquent\Collection;
    public function nameExists(string $name, ?int $ignoreId = null): bool;
    public function syncPermissions(Role $role, array $permissionIds): void;
    public function cloneRole(Role $role, string $newName): Role;
}
