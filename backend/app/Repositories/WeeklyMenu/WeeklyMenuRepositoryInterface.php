<?php

declare(strict_types=1);

namespace App\Repositories\WeeklyMenu;

use App\Models\WeeklyMenu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface WeeklyMenuRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getActive(): Collection;
    public function getById(int $id): ?WeeklyMenu;
    public function getByUuid(string $uuid): ?WeeklyMenu;
    public function getByWeek(string $weekStartDate, ?int $kitchenId = 1): ?WeeklyMenu;
    public function getByDateRange(string $startDate, string $endDate, ?int $kitchenId = 1): Collection;
    public function getPublished(?int $kitchenId = 1): Collection;
    public function getUpcoming(?int $kitchenId = 1): Collection;
    public function create(array $data): WeeklyMenu;
    public function update(int $id, array $data): ?WeeklyMenu;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function getStats(?int $kitchenId = 1): array;
}
