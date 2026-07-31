<?php

declare(strict_types=1);

namespace App\Services\WeeklyMenu;

use App\DTOs\WeeklyMenu\WeeklyMenuItemDTO;
use App\Models\WeeklyMenuItem;
use App\Repositories\WeeklyMenu\WeeklyMenuItemRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WeeklyMenuItemService extends BaseService implements WeeklyMenuItemServiceInterface
{
    protected string $moduleName = 'weekly_menu_item';

    public function __construct(
        protected WeeklyMenuItemRepositoryInterface $weeklyMenuItemRepo,
    ) {}

    public function getPaginatedItems(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->weeklyMenuItemRepo->getPaginated($filters, $perPage);
    }

    public function getItemsByMenu(int $menuId): Collection
    {
        $cacheKey = CacheManager::cacheKey('weekly_menu_item', 'menu', (string) $menuId);

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($menuId) {
            return $this->weeklyMenuItemRepo->getByMenuId($menuId);
        });
    }

    public function getItemsByDate(int $menuId, string $date): Collection
    {
        $cacheKey = CacheManager::cacheKey('weekly_menu_item', 'menu', (string) $menuId, $date);

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($menuId, $date) {
            return $this->weeklyMenuItemRepo->getByDate($menuId, $date);
        });
    }

    public function getItemById(int $id): ?WeeklyMenuItem
    {
        return $this->weeklyMenuItemRepo->getById($id);
    }

    public function createItem(WeeklyMenuItemDTO $dto): WeeklyMenuItem
    {
        return $this->transaction(function () use ($dto) {
            $data = collect($dto->toArray())->filter()->except(['id', 'uuid'])->toArray();

            $item = $this->weeklyMenuItemRepo->create($data);

            CacheManager::flush('weekly_menu_item');

            $this->logInfo('Weekly menu item created', ['item_id' => $item->id, 'menu_id' => $item->weekly_menu_id]);
            $this->logActivity('weekly_menu_item_created', $item);

            return $item;
        });
    }

    public function updateItem(int $id, WeeklyMenuItemDTO $dto): ?WeeklyMenuItem
    {
        return $this->transaction(function () use ($id, $dto) {
            $existing = $this->weeklyMenuItemRepo->getById($id);

            if (! $existing) {
                return null;
            }

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid', 'weekly_menu_id'])->toArray();

            $item = $this->weeklyMenuItemRepo->update($id, $data);

            CacheManager::flush('weekly_menu_item');

            $this->logInfo('Weekly menu item updated', ['item_id' => $id]);
            $this->logActivity('weekly_menu_item_updated', $item);

            return $item;
        });
    }

    public function deleteItem(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $existing = $this->weeklyMenuItemRepo->getById($id);

            if (! $existing) {
                return false;
            }

            $result = $this->weeklyMenuItemRepo->delete($id);

            if ($result) {
                CacheManager::flush('weekly_menu_item');

                $this->logInfo('Weekly menu item deleted', ['item_id' => $id]);
                $this->logActivity('weekly_menu_item_deleted', $existing);
            }

            return $result;
        });
    }

    public function bulkAddItems(int $menuId, array $items): Collection
    {
        return $this->transaction(function () use ($menuId, $items) {
            $created = $this->weeklyMenuItemRepo->bulkCreate($menuId, $items);

            CacheManager::flush('weekly_menu_item');

            $this->logInfo('Bulk weekly menu items created', ['menu_id' => $menuId, 'count' => $created->count()]);
            $this->logActivity('weekly_menu_items_bulk_created', null, ['menu_id' => $menuId, 'count' => $created->count()]);

            return $created;
        });
    }

    public function bulkUpdateItems(int $menuId, array $items): bool
    {
        return $this->transaction(function () use ($menuId, $items) {
            $result = $this->weeklyMenuItemRepo->bulkUpdate($menuId, $items);

            if ($result) {
                CacheManager::flush('weekly_menu_item');

                $this->logInfo('Bulk weekly menu items updated', ['menu_id' => $menuId, 'count' => count($items)]);
                $this->logActivity('weekly_menu_items_bulk_updated', null, ['menu_id' => $menuId, 'count' => count($items)]);
            }

            return $result;
        });
    }

    public function reorderItems(int $menuId, array $order): bool
    {
        return $this->transaction(function () use ($menuId, $order) {
            $result = $this->weeklyMenuItemRepo->reorder($menuId, $order);

            if ($result) {
                CacheManager::flush('weekly_menu_item');

                $this->logInfo('Weekly menu items reordered', ['menu_id' => $menuId, 'order' => $order]);
                $this->logActivity('weekly_menu_items_reordered', null, ['menu_id' => $menuId]);
            }

            return $result;
        });
    }

    public function assignDefaults(int $menuId, string $date): Collection
    {
        return $this->transaction(function () use ($menuId, $date) {
            $defaults = $this->weeklyMenuItemRepo->getDefaults($menuId, $date);

            CacheManager::flush('weekly_menu_item');

            $this->logInfo('Weekly menu defaults assigned', ['menu_id' => $menuId, 'date' => $date, 'count' => $defaults->count()]);

            return $defaults;
        });
    }

    public function getDefaults(int $menuId, string $date): Collection
    {
        return $this->weeklyMenuItemRepo->getDefaults($menuId, $date);
    }
}
