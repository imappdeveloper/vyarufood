<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\Auth\Admin;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminUserServiceInterface
{
    public function list(array $filters = [], int $perPage = 15, string $sort = 'created_at', string $order = 'desc'): LengthAwarePaginator;
    public function search(?string $search, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id): Admin;
    public function findByUuid(string $uuid): Admin;
    public function create(array $data): Admin;
    public function update(Admin $admin, array $data): Admin;
    public function delete(Admin $admin): void;
    public function activate(Admin $admin): Admin;
    public function deactivate(Admin $admin): Admin;
    public function assignRole(Admin $admin, int $roleId): Admin;
    public function removeRole(Admin $admin, int $roleId): Admin;
    public function resetPassword(Admin $admin, string $newPassword): void;
    public function emailExists(string $email, ?int $ignoreId = null): bool;
    public function count(): int;
}
