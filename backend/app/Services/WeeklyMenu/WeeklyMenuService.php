<?php

declare(strict_types=1);

namespace App\Services\WeeklyMenu;

use App\DTOs\WeeklyMenu\WeeklyMenuDTO;
use App\Models\WeeklyMenu;
use App\Repositories\WeeklyMenu\WeeklyMenuRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WeeklyMenuService extends BaseService implements WeeklyMenuServiceInterface
{
    protected string $moduleName = 'weekly_menu';

    public function __construct(
        protected WeeklyMenuRepositoryInterface $weeklyMenuRepo,
    ) {}

    public function getPaginatedMenus(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->weeklyMenuRepo->getPaginated($filters, $perPage);
    }

    public function getMenuById(int $id): ?WeeklyMenu
    {
        return $this->weeklyMenuRepo->getById($id);
    }

    public function getMenuByUuid(string $uuid): ?WeeklyMenu
    {
        return $this->weeklyMenuRepo->getByUuid($uuid);
    }

    public function getMenuByWeek(string $weekStartDate, ?int $kitchenId = 1): ?WeeklyMenu
    {
        $cacheKey = CacheManager::cacheKey('weekly_menu', 'week', $weekStartDate, (string) ($kitchenId ?? 1));

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($weekStartDate, $kitchenId) {
            return $this->weeklyMenuRepo->getByWeek($weekStartDate, $kitchenId);
        });
    }

    public function createMenu(WeeklyMenuDTO $dto): WeeklyMenu
    {
        return $this->transaction(function () use ($dto) {
            $createdBy = auth()->guard('admin')->id();

            $data = $dto->toArray();
            $data['created_by'] = $createdBy;
            $data['updated_by'] = $createdBy;

            $menu = $this->weeklyMenuRepo->create($data);

            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu created', ['menu_id' => $menu->id, 'title' => $menu->title]);
            $this->logActivity('weekly_menu_created', $menu);

            return $menu;
        });
    }

    public function updateMenu(int $id, WeeklyMenuDTO $dto): ?WeeklyMenu
    {
        return $this->transaction(function () use ($id, $dto) {
            $existing = $this->weeklyMenuRepo->getById($id);

            if (! $existing) {
                return null;
            }

            if (! $existing->is_editable) {
                throw new \RuntimeException('This menu is no longer editable.');
            }

            $updatedBy = auth()->guard('admin')->id();

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid', 'created_by'])->toArray();
            $data['updated_by'] = $updatedBy;

            $menu = $this->weeklyMenuRepo->update($id, $data);

            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu updated', ['menu_id' => $id]);
            $this->logActivity('weekly_menu_updated', $menu);

            return $menu;
        });
    }

    public function deleteMenu(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $existing = $this->weeklyMenuRepo->getById($id);

            if (! $existing) {
                return false;
            }

            $result = $this->weeklyMenuRepo->delete($id);

            if ($result) {
                CacheManager::flush('weekly_menu');

                $this->logInfo('Weekly menu deleted', ['menu_id' => $id]);
                $this->logActivity('weekly_menu_deleted', $existing);
            }

            return $result;
        });
    }

    public function restoreMenu(int $id): bool
    {
        $result = $this->weeklyMenuRepo->restore($id);

        if ($result) {
            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu restored', ['menu_id' => $id]);
        }

        return $result;
    }

    public function publishMenu(WeeklyMenu $menu): ?WeeklyMenu
    {
        return $this->transaction(function () use ($menu) {
            $userId = auth()->guard('admin')->id();

            $updated = $this->weeklyMenuRepo->update($menu->id, [
                'status' => 'published',
                'published_at' => now(),
                'published_by' => $userId,
            ]);

            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu published', ['menu_id' => $menu->id]);
            $this->logActivity('weekly_menu_published', $updated);

            return $updated;
        });
    }

    public function unpublishMenu(WeeklyMenu $menu): ?WeeklyMenu
    {
        return $this->transaction(function () use ($menu) {
            $updated = $this->weeklyMenuRepo->update($menu->id, [
                'status' => 'draft',
                'published_at' => null,
                'published_by' => null,
            ]);

            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu unpublished', ['menu_id' => $menu->id]);
            $this->logActivity('weekly_menu_unpublished', $updated);

            return $updated;
        });
    }

    public function copyPreviousWeek(string $fromWeekStart, string $toWeekStart, ?int $kitchenId = 1): ?WeeklyMenu
    {
        return $this->transaction(function () use ($fromWeekStart, $toWeekStart, $kitchenId) {
            $sourceMenu = $this->weeklyMenuRepo->getByWeek($fromWeekStart, $kitchenId);

            if (! $sourceMenu) {
                return null;
            }

            $createdBy = auth()->guard('admin')->id();

            $newMenu = $this->weeklyMenuRepo->create([
                'kitchen_id' => $kitchenId ?? 1,
                'title' => $sourceMenu->title . ' (Copy)',
                'description' => $sourceMenu->description,
                'week_start_date' => $toWeekStart,
                'week_end_date' => \Carbon\Carbon::parse($toWeekStart)->addDays(6)->format('Y-m-d'),
                'status' => 'draft',
                'cut_off_hours' => $sourceMenu->cut_off_hours,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
            ]);

            $sourceItems = $sourceMenu->items;

            foreach ($sourceItems as $sourceItem) {
                $dayOffset = \Carbon\Carbon::parse($sourceMenu->week_start_date)->diffInDays($sourceItem->menu_date);
                $newDate = \Carbon\Carbon::parse($toWeekStart)->addDays($dayOffset)->format('Y-m-d');

                \App\Models\WeeklyMenuItem::create([
                    'weekly_menu_id' => $newMenu->id,
                    'menu_date' => $newDate,
                    'meal_category_id' => $sourceItem->meal_category_id,
                    'meal_id' => $sourceItem->meal_id,
                    'meal_type_id' => $sourceItem->meal_type_id,
                    'display_order' => $sourceItem->display_order,
                    'meal_limit' => $sourceItem->meal_limit,
                    'remaining_quantity' => $sourceItem->meal_limit,
                    'is_default' => $sourceItem->is_default,
                    'is_optional' => $sourceItem->is_optional,
                    'is_recommended' => $sourceItem->is_recommended,
                    'is_active' => $sourceItem->is_active,
                    'status' => $sourceItem->status,
                ]);
            }

            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu copied', ['source_id' => $sourceMenu->id, 'new_id' => $newMenu->id]);
            $this->logActivity('weekly_menu_copied', $newMenu);

            return $newMenu->fresh();
        });
    }

    public function autoGenerateMenu(string $weekStart, string $weekEnd, ?int $kitchenId = 1): ?WeeklyMenu
    {
        return $this->transaction(function () use ($weekStart, $weekEnd, $kitchenId) {
            $createdBy = auth()->guard('admin')->id();

            $menu = $this->weeklyMenuRepo->create([
                'kitchen_id' => $kitchenId ?? 1,
                'title' => 'Auto Generated Menu - ' . $weekStart,
                'description' => 'Automatically generated weekly menu',
                'week_start_date' => $weekStart,
                'week_end_date' => $weekEnd,
                'status' => 'draft',
                'cut_off_hours' => 12,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
            ]);

            CacheManager::flush('weekly_menu');

            $this->logInfo('Weekly menu auto-generated', ['menu_id' => $menu->id, 'week_start' => $weekStart]);
            $this->logActivity('weekly_menu_auto_generated', $menu);

            return $menu;
        });
    }

    public function getMenuStats(?int $kitchenId = 1): array
    {
        $cacheKey = CacheManager::cacheKey('weekly_menu', 'stats', (string) ($kitchenId ?? 1));

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($kitchenId) {
            return $this->weeklyMenuRepo->getStats($kitchenId);
        });
    }

    public function getUpcomingMenus(?int $kitchenId = 1): Collection
    {
        $cacheKey = CacheManager::cacheKey('weekly_menu', 'upcoming', (string) ($kitchenId ?? 1));

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($kitchenId) {
            return $this->weeklyMenuRepo->getUpcoming($kitchenId);
        });
    }

    public function getPublishedMenus(?int $kitchenId = 1): Collection
    {
        $cacheKey = CacheManager::cacheKey('weekly_menu', 'published', (string) ($kitchenId ?? 1));

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($kitchenId) {
            return $this->weeklyMenuRepo->getPublished($kitchenId);
        });
    }
}
