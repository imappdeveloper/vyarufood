<?php

declare(strict_types=1);

namespace App\Services\WeeklyMenu;

use App\DTOs\WeeklyMenu\CustomerMealSelectionDTO;
use App\Models\CustomerMealSelection;
use App\Models\WeeklyMenuItem;
use App\Models\WeeklyMenu;
use App\Repositories\WeeklyMenu\CustomerMealSelectionRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerMealSelectionService extends BaseService implements CustomerMealSelectionServiceInterface
{
    protected string $moduleName = 'customer_meal_selection';

    public function __construct(
        protected CustomerMealSelectionRepositoryInterface $customerMealSelectionRepo,
    ) {}

    public function getPaginatedSelections(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->customerMealSelectionRepo->getPaginated($filters, $perPage);
    }

    public function getCustomerSelections(int $customerId, ?string $weekStart = null): Collection
    {
        $cacheKey = CacheManager::cacheKey('customer_meal_selection', 'customer', (string) $customerId, $weekStart ?? 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($customerId, $weekStart) {
            if ($weekStart) {
                return $this->customerMealSelectionRepo->getCustomerSelectionsForWeek($customerId, $weekStart);
            }

            return $this->customerMealSelectionRepo->getByCustomer($customerId);
        });
    }

    public function getSelectionsByMenu(int $menuId): Collection
    {
        return $this->customerMealSelectionRepo->getByMenuId($menuId);
    }

    public function getSelectionById(int $id): ?CustomerMealSelection
    {
        return $this->customerMealSelectionRepo->getById($id);
    }

    public function selectMeal(CustomerMealSelectionDTO $dto): ?CustomerMealSelection
    {
        return $this->transaction(function () use ($dto) {
            $menuItem = WeeklyMenuItem::find($dto->weeklyMenuItemId);

            if (! $menuItem) {
                throw new \RuntimeException('Weekly menu item not found.');
            }

            $menu = WeeklyMenu::find($dto->weeklyMenuId);

            if (! $menu) {
                throw new \RuntimeException('Weekly menu not found.');
            }

            if ($menu->status !== 'published') {
                throw new \RuntimeException('Menu is not published.');
            }

            $cutOffTime = \Carbon\Carbon::parse($menuItem->menu_date)->subHours($menu->cut_off_hours);

            if (\Carbon\Carbon::now()->isAfter($cutOffTime)) {
                throw new \RuntimeException('Cut-off time has passed for this menu item.');
            }

            if (! $menuItem->is_available) {
                throw new \RuntimeException('This meal is no longer available.');
            }

            $existingSelection = $this->customerMealSelectionRepo->getByCustomer($dto->customerId)
                ->where('menu_date', $dto->menuDate)
                ->first();

            if ($existingSelection) {
                throw new \RuntimeException('Customer already has a selection for this date.');
            }

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid', 'selected_at'])->toArray();
            $data['selection_status'] = 'selected';
            $data['meal_id'] = $menuItem->meal_id;
            $data['meal_category_id'] = $menuItem->meal_category_id;

            $selection = $this->customerMealSelectionRepo->create($data);

            if ($menuItem->meal_limit > 0 && $menuItem->remaining_quantity > 0) {
                $menuItem->decrement('remaining_quantity');
            }

            CacheManager::flush('customer_meal_selection');

            $this->logInfo('Meal selected', ['selection_id' => $selection->id, 'customer_id' => $dto->customerId]);
            $this->logActivity('meal_selected', $selection);

            return $selection;
        });
    }

    public function updateSelection(int $id, CustomerMealSelectionDTO $dto): ?CustomerMealSelection
    {
        return $this->transaction(function () use ($id, $dto) {
            $existing = $this->customerMealSelectionRepo->getById($id);

            if (! $existing) {
                return null;
            }

            $menu = WeeklyMenu::find($existing->weekly_menu_id);

            if ($menu) {
                $cutOffTime = \Carbon\Carbon::parse($existing->menu_date)->subHours($menu->cut_off_hours);

                if (\Carbon\Carbon::now()->isAfter($cutOffTime)) {
                    throw new \RuntimeException('Cut-off time has passed. Cannot update selection.');
                }
            }

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid', 'customer_id', 'weekly_menu_item_id', 'weekly_menu_id', 'menu_date', 'selected_at'])->toArray();

            $selection = $this->customerMealSelectionRepo->update($id, $data);

            CacheManager::flush('customer_meal_selection');

            $this->logInfo('Meal selection updated', ['selection_id' => $id]);
            $this->logActivity('meal_selection_updated', $selection);

            return $selection;
        });
    }

    public function cancelSelection(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $existing = $this->customerMealSelectionRepo->getById($id);

            if (! $existing) {
                return false;
            }

            $menu = WeeklyMenu::find($existing->weekly_menu_id);

            if ($menu) {
                $cutOffTime = \Carbon\Carbon::parse($existing->menu_date)->subHours($menu->cut_off_hours);

                if (\Carbon\Carbon::now()->isAfter($cutOffTime)) {
                    throw new \RuntimeException('Cut-off time has passed. Cannot cancel selection.');
                }
            }

            $menuItem = WeeklyMenuItem::find($existing->weekly_menu_item_id);

            if ($menuItem && $menuItem->meal_limit > 0) {
                $menuItem->increment('remaining_quantity');
            }

            $result = $this->customerMealSelectionRepo->delete($id);

            if ($result) {
                CacheManager::flush('customer_meal_selection');

                $this->logInfo('Meal selection cancelled', ['selection_id' => $id]);
                $this->logActivity('meal_selection_cancelled', $existing);
            }

            return $result;
        });
    }

    public function skipMeal(int $customerId, int $menuItemId, string $menuDate): ?CustomerMealSelection
    {
        return $this->transaction(function () use ($customerId, $menuItemId, $menuDate) {
            $menuItem = WeeklyMenuItem::find($menuItemId);

            if (! $menuItem) {
                throw new \RuntimeException('Weekly menu item not found.');
            }

            $existingSelection = $this->customerMealSelectionRepo->getByCustomer($customerId)
                ->where('menu_date', $menuDate)
                ->first();

            if ($existingSelection) {
                throw new \RuntimeException('Customer already has a selection for this date.');
            }

            $menu = WeeklyMenu::find($menuItem->weekly_menu_id);

            $selection = $this->customerMealSelectionRepo->create([
                'customer_id' => $customerId,
                'weekly_menu_item_id' => $menuItemId,
                'weekly_menu_id' => $menuItem->weekly_menu_id,
                'menu_date' => $menuDate,
                'meal_id' => $menuItem->meal_id,
                'meal_category_id' => $menuItem->meal_category_id,
                'selection_status' => 'skipped',
                'selected_at' => now(),
            ]);

            CacheManager::flush('customer_meal_selection');

            $this->logInfo('Meal skipped', ['selection_id' => $selection->id, 'customer_id' => $customerId]);
            $this->logActivity('meal_skipped', $selection);

            return $selection;
        });
    }

    public function getSelectionSummary(int $menuId): array
    {
        return $this->customerMealSelectionRepo->getSelectionSummary($menuId);
    }

    public function getSelectionsByDate(string $date, ?int $kitchenId = 1): Collection
    {
        return $this->customerMealSelectionRepo->getByDate($date, $kitchenId);
    }

    public function bulkAssignDefaults(int $menuId): int
    {
        return $this->transaction(function () use ($menuId) {
            $count = $this->customerMealSelectionRepo->bulkAssignDefaults($menuId);

            CacheManager::flush('customer_meal_selection');

            $this->logInfo('Bulk defaults assigned', ['menu_id' => $menuId, 'count' => $count]);

            return $count;
        });
    }

    public function canCustomerSelect(int $customerId, int $menuItemId): array
    {
        $menuItem = WeeklyMenuItem::find($menuItemId);

        if (! $menuItem) {
            return ['allowed' => false, 'reason' => 'Menu item not found.'];
        }

        $menu = WeeklyMenu::find($menuItem->weekly_menu_id);

        if (! $menu) {
            return ['allowed' => false, 'reason' => 'Weekly menu not found.'];
        }

        if ($menu->status !== 'published') {
            return ['allowed' => false, 'reason' => 'Menu is not published.'];
        }

        $cutOffTime = \Carbon\Carbon::parse($menuItem->menu_date)->subHours($menu->cut_off_hours);

        if (\Carbon\Carbon::now()->isAfter($cutOffTime)) {
            return ['allowed' => false, 'reason' => 'Cut-off time has passed.'];
        }

        if (! $menuItem->is_available) {
            return ['allowed' => false, 'reason' => 'Meal is no longer available.'];
        }

        $existingSelection = $this->customerMealSelectionRepo->getByCustomer($customerId)
            ->where('menu_date', $menuItem->menu_date->format('Y-m-d'))
            ->first();

        if ($existingSelection) {
            return ['allowed' => false, 'reason' => 'Customer already has a selection for this date.'];
        }

        return ['allowed' => true, 'reason' => null];
    }
}
