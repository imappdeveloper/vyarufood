<?php

declare(strict_types=1);

namespace App\Services\WeeklyMenu;

use App\DTOs\WeeklyMenu\WeeklyMenuDTO;
use App\Models\WeeklyMenu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface WeeklyMenuServiceInterface
{
    public function getPaginatedMenus(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getMenuById(int $id): ?WeeklyMenu;
    public function getMenuByUuid(string $uuid): ?WeeklyMenu;
    public function getMenuByWeek(string $weekStartDate, ?int $kitchenId = 1): ?WeeklyMenu;
    public function createMenu(WeeklyMenuDTO $dto): WeeklyMenu;
    public function updateMenu(int $id, WeeklyMenuDTO $dto): ?WeeklyMenu;
    public function deleteMenu(int $id): bool;
    public function restoreMenu(int $id): bool;
    public function publishMenu(WeeklyMenu $menu): ?WeeklyMenu;
    public function unpublishMenu(WeeklyMenu $menu): ?WeeklyMenu;
    public function copyPreviousWeek(string $fromWeekStart, string $toWeekStart, ?int $kitchenId = 1): ?WeeklyMenu;
    public function autoGenerateMenu(string $weekStart, string $weekEnd, ?int $kitchenId = 1): ?WeeklyMenu;
    public function getMenuStats(?int $kitchenId = 1): array;
    public function getUpcomingMenus(?int $kitchenId = 1): Collection;
    public function getPublishedMenus(?int $kitchenId = 1): Collection;
}
