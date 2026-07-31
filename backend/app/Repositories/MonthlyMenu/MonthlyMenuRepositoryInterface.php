<?php

declare(strict_types=1);

namespace App\Repositories\MonthlyMenu;

use App\Models\MonthlyMenu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MonthlyMenuRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getActive(): Collection;
    public function getById(int $id): ?MonthlyMenu;
    public function getByUuid(string $uuid): ?MonthlyMenu;
    public function getByMonthYear(int $month, int $year, ?int $kitchenId = 1): ?MonthlyMenu;
    public function getPublished(?int $kitchenId = 1): Collection;
    public function create(array $data): MonthlyMenu;
    public function update(int $id, array $data): ?MonthlyMenu;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function getStats(?int $kitchenId = 1): array;
}
