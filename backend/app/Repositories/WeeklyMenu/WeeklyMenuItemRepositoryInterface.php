<?php

declare(strict_types=1);

namespace App\Repositories\WeeklyMenu;

use App\Models\WeeklyMenuItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface WeeklyMenuItemRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getByMenuId(int $menuId): Collection;
    public function getByDate(int $menuId, string $date): Collection;
    public function getById(int $id): ?WeeklyMenuItem;
    public function getByUuid(string $uuid): ?WeeklyMenuItem;
    public function create(array $data): WeeklyMenuItem;
    public function update(int $id, array $data): ?WeeklyMenuItem;
    public function delete(int $id): bool;
    public function bulkCreate(int $menuId, array $items): Collection;
    public function bulkUpdate(int $menuId, array $items): bool;
    public function reorder(int $menuId, array $order): bool;
    public function getDefaults(int $menuId, string $date): Collection;
}
