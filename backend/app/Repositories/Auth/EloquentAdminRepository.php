<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Models\Auth\Admin;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentAdminRepository extends BaseRepository implements AdminRepositoryInterface
{
    protected function model(): Admin
    {
        return new Admin;
    }

    public function find(int $id): ?Admin
    {
        return $this->model->find($id);
    }

    public function findOrFail(int $id): Admin
    {
        return $this->model->findOrFail($id);
    }

    public function findByUuid(string $uuid): ?Admin
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function findByUuidOrFail(string $uuid): Admin
    {
        return $this->model->where('uuid', $uuid)->firstOrFail();
    }

    public function findByEmail(string $email): ?Admin
    {
        return $this->model->where('email', $email)->first();
    }

    public function create(array $data): Admin
    {
        return $this->model->create($data);
    }

    public function update(Admin $admin, array $data): Admin
    {
        $admin->update($data);
        return $admin->fresh();
    }

    public function delete(Admin $admin): bool
    {
        return $admin->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15, string $sort = 'created_at', string $order = 'desc'): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with('roles')
            ->applyFilters($filters);

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function search(?string $search, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with('roles');

        if ($search) {
            $query->search($search);
        }

        $query->applyFilters($filters);

        return $query->orderBy('created_at', 'desc')->paginate(min($perPage, 100));
    }

    public function getActiveAdmins(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->active()->get();
    }

    public function emailExists(string $email, ?int $ignoreId = null): bool
    {
        $query = $this->model->where('email', $email);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }
        return $query->exists();
    }

    public function mobileExists(string $mobile, ?int $ignoreId = null): bool
    {
        $query = $this->model->where('mobile', $mobile);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }
        return $query->exists();
    }
}
