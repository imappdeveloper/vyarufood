<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Models\Auth\Admin;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

interface AdminRepositoryInterface
{
    public function find(int $id): ?Admin;
    public function findOrFail(int $id): Admin;
    public function findByUuid(string $uuid): ?Admin;
    public function findByUuidOrFail(string $uuid): Admin;
    public function findByEmail(string $email): ?Admin;
    public function create(array $data): Admin;
    public function update(Admin $admin, array $data): Admin;
    public function delete(Admin $admin): bool;
    public function paginate(array $filters = [], int $perPage = 15, string $sort = 'created_at', string $order = 'desc'): LengthAwarePaginator;
    public function search(?string $search, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getActiveAdmins(): \Illuminate\Database\Eloquent\Collection;
    public function count(): int;
    public function emailExists(string $email, ?int $ignoreId = null): bool;
    public function mobileExists(string $mobile, ?int $ignoreId = null): bool;
}
