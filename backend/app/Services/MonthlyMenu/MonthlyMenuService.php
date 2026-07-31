<?php

declare(strict_types=1);

namespace App\Services\MonthlyMenu;

use App\DTOs\MonthlyMenu\MonthlyMenuDTO;
use App\Models\MonthlyMenu;
use App\Models\MonthlyMenuItem;
use App\Repositories\MonthlyMenu\MonthlyMenuRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MonthlyMenuService extends BaseService implements MonthlyMenuServiceInterface
{
    protected string $moduleName = 'monthly_menu';

    public function __construct(
        protected MonthlyMenuRepositoryInterface $monthlyMenuRepo,
    ) {}

    public function getPaginatedMenus(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->monthlyMenuRepo->getPaginated($filters, $perPage);
    }

    public function getMenuById(int $id): ?MonthlyMenu
    {
        return $this->monthlyMenuRepo->getById($id);
    }

    public function getMenuByUuid(string $uuid): ?MonthlyMenu
    {
        return $this->monthlyMenuRepo->getByUuid($uuid);
    }

    public function createMenu(MonthlyMenuDTO $dto): MonthlyMenu
    {
        return $this->transaction(function () use ($dto) {
            $createdBy = auth()->guard('admin')->id();

            $existing = $this->monthlyMenuRepo->getByMonthYear($dto->month, $dto->year, $dto->kitchenId);
            if ($existing) {
                throw new \RuntimeException('A monthly menu already exists for this kitchen, month, and year.');
            }

            $data = $dto->toArray();
            $data['created_by'] = $createdBy;
            $data['updated_by'] = $createdBy;

            $menu = $this->monthlyMenuRepo->create($data);

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu created', ['menu_id' => $menu->id, 'title' => $menu->title]);
            $this->logActivity('monthly_menu_created', $menu);

            return $menu;
        });
    }

    public function updateMenu(int $id, MonthlyMenuDTO $dto): ?MonthlyMenu
    {
        return $this->transaction(function () use ($id, $dto) {
            $existing = $this->monthlyMenuRepo->getById($id);

            if (! $existing) {
                return null;
            }

            if (in_array($existing->status, ['published', 'approved'])) {
                throw new \RuntimeException('Cannot edit a published or approved menu. Unpublish it first.');
            }

            $updatedBy = auth()->guard('admin')->id();

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid', 'created_by'])->toArray();
            $data['updated_by'] = $updatedBy;

            $menu = $this->monthlyMenuRepo->update($id, $data);

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu updated', ['menu_id' => $id]);
            $this->logActivity('monthly_menu_updated', $menu);

            return $menu;
        });
    }

    public function deleteMenu(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $existing = $this->monthlyMenuRepo->getById($id);

            if (! $existing) {
                return false;
            }

            $result = $this->monthlyMenuRepo->delete($id);

            if ($result) {
                CacheManager::flush('monthly_menu');
                $this->logInfo('Monthly menu deleted', ['menu_id' => $id]);
                $this->logActivity('monthly_menu_deleted', $existing);
            }

            return $result;
        });
    }

    public function restoreMenu(int $id): bool
    {
        $result = $this->monthlyMenuRepo->restore($id);

        if ($result) {
            CacheManager::flush('monthly_menu');
            $this->logInfo('Monthly menu restored', ['menu_id' => $id]);
        }

        return $result;
    }

    public function publishMenu(MonthlyMenu $menu): ?MonthlyMenu
    {
        return $this->transaction(function () use ($menu) {
            $userId = auth()->guard('admin')->id();

            $updated = $this->monthlyMenuRepo->update($menu->id, [
                'status' => 'published',
                'published_at' => now(),
                'published_by' => $userId,
            ]);

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu published', ['menu_id' => $menu->id]);
            $this->logActivity('monthly_menu_published', $updated);

            return $updated;
        });
    }

    public function unpublishMenu(MonthlyMenu $menu): ?MonthlyMenu
    {
        return $this->transaction(function () use ($menu) {
            $updated = $this->monthlyMenuRepo->update($menu->id, [
                'status' => 'draft',
                'published_at' => null,
                'published_by' => null,
            ]);

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu unpublished', ['menu_id' => $menu->id]);
            $this->logActivity('monthly_menu_unpublished', $updated);

            return $updated;
        });
    }

    public function approveMenu(MonthlyMenu $menu): ?MonthlyMenu
    {
        return $this->transaction(function () use ($menu) {
            $userId = auth()->guard('admin')->id();

            $updated = $this->monthlyMenuRepo->update($menu->id, [
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $userId,
            ]);

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu approved', ['menu_id' => $menu->id]);
            $this->logActivity('monthly_menu_approved', $updated);

            return $updated;
        });
    }

    public function duplicateMenu(int $id, int $targetMonth, int $targetYear): ?MonthlyMenu
    {
        return $this->transaction(function () use ($id, $targetMonth, $targetYear) {
            $source = $this->monthlyMenuRepo->getById($id);

            if (! $source) {
                return null;
            }

            $userId = auth()->guard('admin')->id();

            $newMenu = $this->monthlyMenuRepo->create([
                'kitchen_id' => $source->kitchen_id,
                'title' => $source->title . ' (Copy - ' . $targetMonth . '/' . $targetYear . ')',
                'description' => $source->description,
                'month' => $targetMonth,
                'year' => $targetYear,
                'menu_template_id' => $source->menu_template_id,
                'status' => 'draft',
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            foreach ($source->items as $item) {
                $dayInTarget = cal_days_in_month(CAL_GREGORIAN, $targetMonth, $targetYear);
                $sourceDay = (int) $item->menu_date->format('d');
                $targetDay = min($sourceDay, $dayInTarget);

                $targetDate = sprintf('%04d-%02d-%02d', $targetYear, $targetMonth, $targetDay);

                MonthlyMenuItem::create([
                    'monthly_menu_id' => $newMenu->id,
                    'menu_date' => $targetDate,
                    'day_name' => $item->day_name,
                    'meal_category_id' => $item->meal_category_id,
                    'meal_id' => $item->meal_id,
                    'meal_type_id' => $item->meal_type_id,
                    'display_order' => $item->display_order,
                    'meal_limit' => $item->meal_limit,
                    'remaining_quantity' => $item->meal_limit,
                    'is_default' => $item->is_default,
                    'is_optional' => $item->is_optional,
                    'is_special' => $item->is_special,
                    'is_festival' => $item->is_festival,
                    'status' => $item->status,
                ]);
            }

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu duplicated', ['source_id' => $id, 'new_id' => $newMenu->id]);
            $this->logActivity('monthly_menu_duplicated', $newMenu);

            return $newMenu->fresh();
        });
    }

    public function copyPreviousMonth(int $sourceMonth, int $sourceYear, int $targetMonth, int $targetYear, ?int $kitchenId = 1): ?MonthlyMenu
    {
        return $this->transaction(function () use ($sourceMonth, $sourceYear, $targetMonth, $targetYear, $kitchenId) {
            $source = $this->monthlyMenuRepo->getByMonthYear($sourceMonth, $sourceYear, $kitchenId);

            if (! $source) {
                return null;
            }

            $userId = auth()->guard('admin')->id();

            $newMenu = $this->monthlyMenuRepo->create([
                'kitchen_id' => $kitchenId ?? 1,
                'title' => $source->title . ' (Copy)',
                'description' => $source->description,
                'month' => $targetMonth,
                'year' => $targetYear,
                'menu_template_id' => $source->menu_template_id,
                'status' => 'draft',
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            $dayInTarget = cal_days_in_month(CAL_GREGORIAN, $targetMonth, $targetYear);

            foreach ($source->items as $item) {
                $sourceDay = (int) $item->menu_date->format('d');
                $targetDay = min($sourceDay, $dayInTarget);
                $targetDate = sprintf('%04d-%02d-%02d', $targetYear, $targetMonth, $targetDay);

                MonthlyMenuItem::create([
                    'monthly_menu_id' => $newMenu->id,
                    'menu_date' => $targetDate,
                    'day_name' => $item->day_name,
                    'meal_category_id' => $item->meal_category_id,
                    'meal_id' => $item->meal_id,
                    'meal_type_id' => $item->meal_type_id,
                    'display_order' => $item->display_order,
                    'meal_limit' => $item->meal_limit,
                    'remaining_quantity' => $item->meal_limit,
                    'is_default' => $item->is_default,
                    'is_optional' => $item->is_optional,
                    'is_special' => $item->is_special,
                    'is_festival' => $item->is_festival,
                    'status' => $item->status,
                ]);
            }

            CacheManager::flush('monthly_menu');

            $this->logInfo('Monthly menu copied from previous month', ['source_id' => $source->id, 'new_id' => $newMenu->id]);
            $this->logActivity('monthly_menu_copied', $newMenu);

            return $newMenu->fresh();
        });
    }

    public function generateWeeklyMenus(int $menuId): ?MonthlyMenu
    {
        return $this->transaction(function () use ($menuId) {
            $menu = $this->monthlyMenuRepo->getById($menuId);

            if (! $menu || $menu->status !== 'approved') {
                throw new \RuntimeException('Only approved monthly menus can generate weekly menus.');
            }

            $itemsByDate = $menu->items->groupBy(function ($item) {
                return $item->menu_date->format('Y-m-d');
            });

            $userId = auth()->guard('admin')->id();
            $startDate = \Carbon\Carbon::create($menu->year, $menu->month, 1);
            $endDate = $startDate->copy()->endOfMonth();
            $current = $startDate->copy();

            while ($current->lte($endDate)) {
                $dateStr = $current->format('Y-m-d');
                $dayItems = $itemsByDate->get($dateStr, collect());

                if ($dayItems->isNotEmpty()) {
                    $weekStart = $current->copy()->startOfWeek()->format('Y-m-d');
                    $weekEnd = $current->copy()->endOfWeek()->format('Y-m-d');

                    if ($current->dayOfWeek === \Carbon\Carbon::MONDAY || $current->day === 1) {
                        $weeklyMenu = \App\Models\WeeklyMenu::create([
                            'uuid' => \Str::uuid(),
                            'kitchen_id' => $menu->kitchen_id,
                            'title' => 'Week of ' . $weekStart . ' from Monthly Plan',
                            'description' => 'Auto-generated from monthly menu: ' . $menu->title,
                            'week_start_date' => $weekStart,
                            'week_end_date' => $weekEnd,
                            'status' => 'draft',
                            'cut_off_hours' => 12,
                            'created_by' => $userId,
                            'updated_by' => $userId,
                        ]);

                        foreach ($dayItems as $dayItem) {
                            \App\Models\WeeklyMenuItem::create([
                                'uuid' => \Str::uuid(),
                                'weekly_menu_id' => $weeklyMenu->id,
                                'menu_date' => $dateStr,
                                'meal_category_id' => $dayItem->meal_category_id,
                                'meal_id' => $dayItem->meal_id,
                                'meal_type_id' => $dayItem->meal_type_id,
                                'display_order' => $dayItem->display_order,
                                'meal_limit' => $dayItem->meal_limit,
                                'remaining_quantity' => $dayItem->meal_limit,
                                'is_default' => $dayItem->is_default,
                                'is_optional' => $dayItem->is_optional,
                                'is_recommended' => false,
                                'is_active' => true,
                                'status' => 'active',
                            ]);
                        }
                    } else {
                        $existingWeekly = \App\Models\WeeklyMenu::where('week_start_date', '<=', $dateStr)
                            ->where('week_end_date', '>=', $dateStr)
                            ->where('kitchen_id', $menu->kitchen_id)
                            ->first();

                        if ($existingWeekly) {
                            foreach ($dayItems as $dayItem) {
                                \App\Models\WeeklyMenuItem::create([
                                    'uuid' => \Str::uuid(),
                                    'weekly_menu_id' => $existingWeekly->id,
                                    'menu_date' => $dateStr,
                                    'meal_category_id' => $dayItem->meal_category_id,
                                    'meal_id' => $dayItem->meal_id,
                                    'meal_type_id' => $dayItem->meal_type_id,
                                    'display_order' => $dayItem->display_order,
                                    'meal_limit' => $dayItem->meal_limit,
                                    'remaining_quantity' => $dayItem->meal_limit,
                                    'is_default' => $dayItem->is_default,
                                    'is_optional' => $dayItem->is_optional,
                                    'is_recommended' => false,
                                    'is_active' => true,
                                    'status' => 'active',
                                ]);
                            }
                        }
                    }
                }

                $current->addDay();
            }

            CacheManager::flush('weekly_menu');
            CacheManager::flush('monthly_menu');

            $this->logInfo('Weekly menus generated from monthly menu', ['menu_id' => $menuId]);
            $this->logActivity('weekly_menus_generated', $menu);

            return $menu;
        });
    }

    public function getMenuStats(?int $kitchenId = 1): array
    {
        $cacheKey = CacheManager::cacheKey('monthly_menu', 'stats', (string) ($kitchenId ?? 1));

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($kitchenId) {
            return $this->monthlyMenuRepo->getStats($kitchenId);
        });
    }

    public function getForecast(int $menuId): array
    {
        $menu = $this->monthlyMenuRepo->getById($menuId);

        if (! $menu) {
            return [];
        }

        $items = $menu->items()->with(['meal', 'mealCategory', 'mealType'])->get();

        $totalMeals = $items->count();
        $totalMealsByCategory = $items->groupBy(fn ($item) => $item->mealCategory?->name ?? 'Unknown')
            ->map(fn ($group) => $group->count());
        $totalMealsByType = $items->groupBy(fn ($item) => $item->mealType?->name ?? 'Unknown')
            ->map(fn ($group) => $group->count());
        $totalProduction = $items->sum('meal_limit');
        $totalCalories = $items->sum(fn ($item) => ($item->meal?->calories ?? 0) * $item->meal_limit);
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $menu->month, $menu->year);
        $avgMealsPerDay = $daysInMonth > 0 ? round($totalMeals / $daysInMonth, 1) : 0;

        $mealPopularity = $items->groupBy(fn ($item) => $item->meal?->name ?? 'Unknown')
            ->map(fn ($group) => [
                'count' => $group->count(),
                'total_limit' => $group->sum('meal_limit'),
            ])
            ->sortByDesc('count')
            ->toArray();

        return [
            'menu_id' => $menu->id,
            'month' => $menu->month,
            'year' => $menu->year,
            'days_in_month' => $daysInMonth,
            'total_meal_assignments' => $totalMeals,
            'total_production_capacity' => $totalProduction,
            'total_estimated_calories' => $totalCalories,
            'avg_meals_per_day' => $avgMealsPerDay,
            'by_category' => $totalMealsByCategory->toArray(),
            'by_type' => $totalMealsByType->toArray(),
            'meal_popularity' => $mealPopularity,
        ];
    }

    public function applyTemplate(int $menuId, int $templateId): ?MonthlyMenu
    {
        return $this->transaction(function () use ($menuId, $templateId) {
            $menu = $this->monthlyMenuRepo->getById($menuId);
            $template = \App\Models\MenuTemplate::with('items')->find($templateId);

            if (! $menu || ! $template) {
                return null;
            }

            if (in_array($menu->status, ['published', 'approved'])) {
                throw new \RuntimeException('Cannot modify a published or approved menu.');
            }

            $menu->items()->delete();

            $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $menu->month, $menu->year);
            $startDate = \Carbon\Carbon::create($menu->year, $menu->month, 1);

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = $startDate->copy()->day($day);
                $dayName = strtolower($date->englishDayOfWeek);

                $templateItems = $template->items->filter(fn ($item) => $item->day_name === $dayName);

                foreach ($templateItems as $index => $templateItem) {
                    MonthlyMenuItem::create([
                        'uuid' => \Str::uuid(),
                        'monthly_menu_id' => $menu->id,
                        'menu_date' => $date->format('Y-m-d'),
                        'day_name' => $dayName,
                        'meal_category_id' => $templateItem->meal_category_id,
                        'meal_id' => $templateItem->meal_id,
                        'meal_type_id' => $templateItem->meal_type_id,
                        'display_order' => $templateItem->display_order ?: $index,
                        'meal_limit' => 50,
                        'remaining_quantity' => 50,
                        'is_default' => false,
                        'is_optional' => false,
                        'is_special' => false,
                        'is_festival' => false,
                        'status' => 'active',
                    ]);
                }
            }

            $this->monthlyMenuRepo->update($menu->id, ['menu_template_id' => $templateId]);

            CacheManager::flush('monthly_menu');

            $this->logInfo('Template applied to monthly menu', ['menu_id' => $menuId, 'template_id' => $templateId]);
            $this->logActivity('template_applied', $menu);

            return $menu->fresh();
        });
    }
}
