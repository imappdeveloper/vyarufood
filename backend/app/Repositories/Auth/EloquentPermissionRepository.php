<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Support\BaseRepository;
use Spatie\Permission\Models\Permission;

class EloquentPermissionRepository extends BaseRepository implements PermissionRepositoryInterface
{
    protected function model(): Permission
    {
        return new Permission;
    }

    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->where('guard_name', 'admin')->orderBy('group')->orderBy('name')->get();
    }

    public function grouped(): array
    {
        return $this->model->where('guard_name', 'admin')
            ->orderBy('group')
            ->orderBy('name')
            ->get()
            ->groupBy('group')
            ->map(fn ($items) => $items->values())
            ->toArray();
    }

    public function findByIds(array $ids): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->whereIn('id', $ids)->where('guard_name', 'admin')->get();
    }

    public function getByGroup(string $group): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->where('group', $group)->where('guard_name', 'admin')->orderBy('name')->get();
    }
}
