<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Auth\Admin;
use App\Repositories\Auth\AdminRepositoryInterface;
use App\Support\BaseService;
use App\Support\UploadManager;
use App\Exceptions\BusinessException;
use App\Enums\StatusEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class AdminUserService extends BaseService implements AdminUserServiceInterface
{
    protected string $moduleName = 'admin_users';

    public function __construct(
        protected AdminRepositoryInterface $adminRepo,
        protected UploadManager $uploadManager,
    ) {}

    public function list(array $filters = [], int $perPage = 15, string $sort = 'created_at', string $order = 'desc'): LengthAwarePaginator
    {
        return $this->adminRepo->paginate($filters, $perPage, $sort, $order);
    }

    public function search(?string $search, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->adminRepo->search($search, $filters, $perPage);
    }

    public function findById(int $id): Admin
    {
        return $this->adminRepo->findOrFail($id)->load('roles', 'permissions');
    }

    public function findByUuid(string $uuid): Admin
    {
        return $this->adminRepo->findByUuidOrFail($uuid)->load('roles', 'permissions');
    }

    public function create(array $data): Admin
    {
        if ($this->adminRepo->emailExists($data['email'])) {
            throw new BusinessException('Email already exists.', 422);
        }

        if (!empty($data['mobile']) && $this->adminRepo->mobileExists($data['mobile'])) {
            throw new BusinessException('Mobile number already exists.', 422);
        }

        $data['password'] = Hash::make($data['password']);
        $data['email_verified_at'] = now();

        $admin = $this->adminRepo->create($data);

        if (!empty($data['role_id'])) {
            $role = \Spatie\Permission\Models\Role::find($data['role_id']);
            if ($role) {
                $admin->assignRole($role);
            }
        }

        $this->logInfo('Admin created', ['admin_id' => $admin->id, 'email' => $admin->email]);
        return $admin->fresh()->load('roles');
    }

    public function update(Admin $admin, array $data): Admin
    {
        if (isset($data['email']) && $this->adminRepo->emailExists($data['email'], $admin->id)) {
            throw new BusinessException('Email already exists.', 422);
        }

        if (isset($data['mobile']) && $data['mobile'] && $this->adminRepo->mobileExists($data['mobile'], $admin->id)) {
            throw new BusinessException('Mobile number already exists.', 422);
        }

        $admin = $this->adminRepo->update($admin, $data);

        if (isset($data['role_id'])) {
            $role = \Spatie\Permission\Models\Role::find($data['role_id']);
            if ($role) {
                $admin->syncRoles([$role]);
            }
        }

        $this->logInfo('Admin updated', ['admin_id' => $admin->id]);
        return $admin->fresh()->load('roles');
    }

    public function delete(Admin $admin): void
    {
        if ($admin->roles->contains('name', 'super_admin')) {
            throw new BusinessException('Cannot delete a super admin.', 422);
        }

        $this->adminRepo->delete($admin);
        $this->logInfo('Admin deleted', ['admin_id' => $admin->id]);
    }

    public function activate(Admin $admin): Admin
    {
        $admin = $this->adminRepo->update($admin, ['status' => StatusEnum::Active]);
        $this->logInfo('Admin activated', ['admin_id' => $admin->id]);
        return $admin->fresh()->load('roles');
    }

    public function deactivate(Admin $admin): Admin
    {
        $admin = $this->adminRepo->update($admin, ['status' => StatusEnum::Inactive]);
        $this->logInfo('Admin deactivated', ['admin_id' => $admin->id]);
        return $admin->fresh()->load('roles');
    }

    public function assignRole(Admin $admin, int $roleId): Admin
    {
        $role = \Spatie\Permission\Models\Role::findOrFail($roleId);
        $admin->syncRoles([$role]);
        $this->logInfo('Role assigned to admin', ['admin_id' => $admin->id, 'role' => $role->name]);
        return $admin->fresh()->load('roles');
    }

    public function removeRole(Admin $admin, int $roleId): Admin
    {
        $role = \Spatie\Permission\Models\Role::findOrFail($roleId);
        $admin->removeRole($role);
        $this->logInfo('Role removed from admin', ['admin_id' => $admin->id, 'role' => $role->name]);
        return $admin->fresh()->load('roles');
    }

    public function resetPassword(Admin $admin, string $newPassword): void
    {
        $admin->update(['password' => Hash::make($newPassword)]);
        $admin->tokens()->delete();
        $this->logInfo('Admin password reset', ['admin_id' => $admin->id]);
    }

    public function emailExists(string $email, ?int $ignoreId = null): bool
    {
        return $this->adminRepo->emailExists($email, $ignoreId);
    }

    public function count(): int
    {
        return $this->adminRepo->count();
    }
}
