<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Support\BaseRepository;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentRoleRepository extends BaseRepository implements RoleRepositoryInterface
{
    protected function model(): Role
    {
        return new Role;
    }

    public function find(int $id): ?Role
    {
        return $this->model->find($id);
    }

    public function findOrFail(int $id): Role
    {
        return $this->model->findOrFail($id);
    }

    public function findByName(string $name): ?Role
    {
        return $this->model->where('name', $name)->where('guard_name', 'admin')->first();
    }

    public function paginate(int $perPage = 15, string $sort = 'sort_order', string $order = 'asc'): LengthAwarePaginator
    {
        return $this->model->withCount('admins')->orderBy($sort, $order)->paginate(min($perPage, 100));
    }

    public function create(array $data): Role
    {
        return $this->model->create($data);
    }

    public function update(Role $role, array $data): Role
    {
        $role->update($data);
        return $role->fresh();
    }

    public function delete(Role $role): bool
    {
        return $role->delete();
    }

    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->withCount('admins')->orderBy('sort_order', 'asc')->get();
    }

    public function nameExists(string $name, ?int $ignoreId = null): bool
    {
        $query = $this->model->where('name', $name)->where('guard_name', 'admin');
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }
        return $query->exists();
    }

    public function syncPermissions(Role $role, array $permissionIds): void
    {
        $permissions = Permission::whereIn('id', $permissionIds)->where('guard_name', 'admin')->get();
        $role->syncPermissions($permissions);
    }

    public function cloneRole(Role $role, string $newName): Role
    {
        $newRole = $this->create([
            'name' => $newName,
            'guard_name' => 'admin',
            'display_name' => $role->display_name . ' (Clone)',
            'description' => $role->description,
            'is_default' => false,
            'sort_order' => $this->model->max('sort_order') + 1,
        ]);

        $newRole->syncPermissions($role->permissions);

        return $newRole;
    }
}
