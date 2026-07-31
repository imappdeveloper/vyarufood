<?php

declare(strict_types=1);

namespace App\Services\MonthlyMenu;

use App\DTOs\MonthlyMenu\MonthlyMenuDTO;
use App\Models\MonthlyMenu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MonthlyMenuServiceInterface
{
    public function getPaginatedMenus(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getMenuById(int $id): ?MonthlyMenu;
    public function getMenuByUuid(string $uuid): ?MonthlyMenu;
    public function createMenu(MonthlyMenuDTO $dto): MonthlyMenu;
    public function updateMenu(int $id, MonthlyMenuDTO $dto): ?MonthlyMenu;
    public function deleteMenu(int $id): bool;
    public function restoreMenu(int $id): bool;
    public function publishMenu(MonthlyMenu $menu): ?MonthlyMenu;
    public function unpublishMenu(MonthlyMenu $menu): ?MonthlyMenu;
    public function approveMenu(MonthlyMenu $menu): ?MonthlyMenu;
    public function duplicateMenu(int $id, int $targetMonth, int $targetYear): ?MonthlyMenu;
    public function copyPreviousMonth(int $sourceMonth, int $sourceYear, int $targetMonth, int $targetYear, ?int $kitchenId = 1): ?MonthlyMenu;
    public function generateWeeklyMenus(int $menuId): ?MonthlyMenu;
    public function getMenuStats(?int $kitchenId = 1): array;
    public function getForecast(int $menuId): array;
    public function applyTemplate(int $menuId, int $templateId): ?MonthlyMenu;
}
