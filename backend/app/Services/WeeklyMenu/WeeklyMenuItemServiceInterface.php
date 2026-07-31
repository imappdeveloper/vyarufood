<?php

declare(strict_types=1);

namespace App\Services\WeeklyMenu;

use App\DTOs\WeeklyMenu\WeeklyMenuItemDTO;
use App\Models\WeeklyMenuItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface WeeklyMenuItemServiceInterface
{
    public function getPaginatedItems(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getItemsByMenu(int $menuId): Collection;
    public function getItemsByDate(int $menuId, string $date): Collection;
    public function getItemById(int $id): ?WeeklyMenuItem;
    public function createItem(WeeklyMenuItemDTO $dto): WeeklyMenuItem;
    public function updateItem(int $id, WeeklyMenuItemDTO $dto): ?WeeklyMenuItem;
    public function deleteItem(int $id): bool;
    public function bulkAddItems(int $menuId, array $items): Collection;
    public function bulkUpdateItems(int $menuId, array $items): bool;
    public function reorderItems(int $menuId, array $order): bool;
    public function assignDefaults(int $menuId, string $date): Collection;
    public function getDefaults(int $menuId, string $date): Collection;
}
