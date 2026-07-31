<?php

declare(strict_types=1);

namespace App\Repositories\MonthlyMenu;

use App\Models\MenuTemplate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MenuTemplateRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getAll(?int $kitchenId = 1): Collection;
    public function getById(int $id): ?MenuTemplate;
    public function getByUuid(string $uuid): ?MenuTemplate;
    public function getDefault(?int $kitchenId = 1): ?MenuTemplate;
    public function create(array $data): MenuTemplate;
    public function update(int $id, array $data): ?MenuTemplate;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
}
