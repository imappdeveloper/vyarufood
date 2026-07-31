<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use Spatie\Permission\Models\Permission;

interface PermissionRepositoryInterface
{
    public function all(): \Illuminate\Database\Eloquent\Collection;
    public function grouped(): array;
    public function findByIds(array $ids): \Illuminate\Database\Eloquent\Collection;
    public function getByGroup(string $group): \Illuminate\Database\Eloquent\Collection;
}
