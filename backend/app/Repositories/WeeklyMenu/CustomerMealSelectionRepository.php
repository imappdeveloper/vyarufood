<?php

declare(strict_types=1);

namespace App\Repositories\WeeklyMenu;

use App\Models\CustomerMealSelection;
use App\Models\WeeklyMenuItem;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerMealSelectionRepository extends BaseRepository implements CustomerMealSelectionRepositoryInterface
{
    protected function model(): CustomerMealSelection
    {
        return new CustomerMealSelection;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['customer', 'weeklyMenu', 'weeklyMenuItem', 'meal', 'mealCategory']);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['weekly_menu_id'])) {
            $query->where('weekly_menu_id', $filters['weekly_menu_id']);
        }

        if (! empty($filters['menu_date'])) {
            $query->where('menu_date', $filters['menu_date']);
        }

        if (! empty($filters['selection_status'])) {
            $query->where('selection_status', $filters['selection_status']);
        }

        if (! empty($filters['meal_category_id'])) {
            $query->where('meal_category_id', $filters['meal_category_id']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['date_from'])) {
            $query->where('menu_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('menu_date', '<=', $filters['date_to']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('menu_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByCustomer(int $customerId): Collection
    {
        return $this->model->where('customer_id', $customerId)
            ->with(['weeklyMenu', 'weeklyMenuItem', 'meal', 'mealCategory'])
            ->orderBy('menu_date', 'desc')
            ->get();
    }

    public function getByMenuId(int $menuId): Collection
    {
        return $this->model->where('weekly_menu_id', $menuId)
            ->with(['customer', 'weeklyMenuItem', 'meal', 'mealCategory'])
            ->orderBy('menu_date', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function getByDate(string $date, ?int $kitchenId = 1): Collection
    {
        return $this->model->where('menu_date', $date)
            ->whereHas('weeklyMenu', function ($q) use ($kitchenId) {
                $q->where('kitchen_id', $kitchenId ?? 1);
            })
            ->with(['customer', 'weeklyMenu', 'meal', 'mealCategory'])
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function getById(int $id): ?CustomerMealSelection
    {
        return $this->model->with(['customer', 'weeklyMenu', 'weeklyMenuItem', 'meal', 'mealCategory'])
            ->find($id);
    }

    public function getByUuid(string $uuid): ?CustomerMealSelection
    {
        return $this->model->where('uuid', $uuid)
            ->with(['customer', 'weeklyMenu', 'weeklyMenuItem', 'meal', 'mealCategory'])
            ->first();
    }

    public function create(array $data): CustomerMealSelection
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?CustomerMealSelection
    {
        $selection = $this->model->find($id);

        if (! $selection) {
            return null;
        }

        $selection->update($data);

        return $selection->fresh();
    }

    public function delete(int $id): bool
    {
        $selection = $this->model->find($id);

        if (! $selection) {
            return false;
        }

        return $selection->delete();
    }

    public function getCustomerSelectionsForWeek(int $customerId, string $weekStartDate): Collection
    {
        return $this->model->where('customer_id', $customerId)
            ->whereHas('weeklyMenu', function ($q) use ($weekStartDate) {
                $q->where('week_start_date', $weekStartDate);
            })
            ->with(['weeklyMenu', 'weeklyMenuItem', 'meal', 'mealCategory'])
            ->orderBy('menu_date', 'asc')
            ->get();
    }

    public function getSelectionSummary(int $menuId): array
    {
        $selections = $this->model->where('weekly_menu_id', $menuId)
            ->get();

        $summary = [
            'total_selections' => $selections->count(),
            'selected_count' => $selections->where('selection_status', 'selected')->count(),
            'default_count' => $selections->where('selection_status', 'default')->count(),
            'skipped_count' => $selections->where('selection_status', 'skipped')->count(),
            'unique_customers' => $selections->pluck('customer_id')->unique()->count(),
            'by_date' => [],
            'by_category' => [],
        ];

        foreach ($selections->groupBy('menu_date') as $date => $dateSelections) {
            $summary['by_date'][$date] = [
                'total' => $dateSelections->count(),
                'selected' => $dateSelections->where('selection_status', 'selected')->count(),
                'default' => $dateSelections->where('selection_status', 'default')->count(),
                'skipped' => $dateSelections->where('selection_status', 'skipped')->count(),
            ];
        }

        foreach ($selections->groupBy('meal_category_id') as $categoryId => $categorySelections) {
            $summary['by_category'][$categoryId] = [
                'total' => $categorySelections->count(),
                'selected' => $categorySelections->where('selection_status', 'selected')->count(),
                'default' => $categorySelections->where('selection_status', 'default')->count(),
                'skipped' => $categorySelections->where('selection_status', 'skipped')->count(),
            ];
        }

        return $summary;
    }

    public function bulkAssignDefaults(int $menuId): int
    {
        $defaultItems = WeeklyMenuItem::where('weekly_menu_id', $menuId)
            ->where('is_default', true)
            ->where('is_active', true)
            ->get();

        $count = 0;

        foreach ($defaultItems as $item) {
            $existingSelection = $this->model->where('weekly_menu_item_id', $item->id)
                ->where('selection_status', '!=', 'skipped')
                ->exists();

            if (! $existingSelection) {
                $this->model->create([
                    'customer_id' => null,
                    'weekly_menu_item_id' => $item->id,
                    'weekly_menu_id' => $menuId,
                    'menu_date' => $item->menu_date,
                    'meal_id' => $item->meal_id,
                    'meal_category_id' => $item->meal_category_id,
                    'selection_status' => 'default',
                ]);
                $count++;
            }
        }

        return $count;
    }
}
