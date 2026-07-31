<?php

declare(strict_types=1);

namespace App\Repositories\WeeklyMenu;

use App\Models\WeeklyMenuItem;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WeeklyMenuItemRepository extends BaseRepository implements WeeklyMenuItemRepositoryInterface
{
    protected function model(): WeeklyMenuItem
    {
        return new WeeklyMenuItem;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['weeklyMenu', 'mealCategory', 'meal', 'mealType']);

        if (! empty($filters['weekly_menu_id'])) {
            $query->where('weekly_menu_id', $filters['weekly_menu_id']);
        }

        if (! empty($filters['menu_date'])) {
            $query->where('menu_date', $filters['menu_date']);
        }

        if (! empty($filters['meal_category_id'])) {
            $query->where('meal_category_id', $filters['meal_category_id']);
        }

        if (! empty($filters['meal_id'])) {
            $query->where('meal_id', $filters['meal_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_default']) && $filters['is_default'] !== '') {
            $query->where('is_default', filter_var($filters['is_default'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_optional']) && $filters['is_optional'] !== '') {
            $query->where('is_optional', filter_var($filters['is_optional'], FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('menu_date', 'asc')
            ->orderBy('display_order', 'asc')
            ->paginate($perPage);
    }

    public function getByMenuId(int $menuId): Collection
    {
        return $this->model->where('weekly_menu_id', $menuId)
            ->with(['mealCategory', 'meal', 'mealType'])
            ->orderBy('menu_date', 'asc')
            ->orderBy('display_order', 'asc')
            ->get();
    }

    public function getByDate(int $menuId, string $date): Collection
    {
        return $this->model->where('weekly_menu_id', $menuId)
            ->where('menu_date', $date)
            ->with(['mealCategory', 'meal', 'mealType'])
            ->orderBy('display_order', 'asc')
            ->get();
    }

    public function getById(int $id): ?WeeklyMenuItem
    {
        return $this->model->with(['weeklyMenu', 'mealCategory', 'meal', 'mealType'])
            ->find($id);
    }

    public function getByUuid(string $uuid): ?WeeklyMenuItem
    {
        return $this->model->where('uuid', $uuid)
            ->with(['weeklyMenu', 'mealCategory', 'meal', 'mealType'])
            ->first();
    }

    public function create(array $data): WeeklyMenuItem
    {
        if (isset($data['meal_limit']) && (int) $data['meal_limit'] > 0 && ! isset($data['remaining_quantity'])) {
            $data['remaining_quantity'] = $data['meal_limit'];
        }

        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?WeeklyMenuItem
    {
        $item = $this->model->find($id);

        if (! $item) {
            return null;
        }

        $item->update($data);

        return $item->fresh();
    }

    public function delete(int $id): bool
    {
        $item = $this->model->find($id);

        if (! $item) {
            return false;
        }

        return $item->delete();
    }

    public function bulkCreate(int $menuId, array $items): Collection
    {
        $created = collect();

        foreach ($items as $itemData) {
            $itemData['weekly_menu_id'] = $menuId;

            if (isset($itemData['meal_limit']) && (int) $itemData['meal_limit'] > 0 && ! isset($itemData['remaining_quantity'])) {
                $itemData['remaining_quantity'] = $itemData['meal_limit'];
            }

            $created->push($this->model->create($itemData));
        }

        return $created;
    }

    public function bulkUpdate(int $menuId, array $items): bool
    {
        foreach ($items as $itemData) {
            if (empty($itemData['id'])) {
                continue;
            }

            $item = $this->model->where('id', $itemData['id'])
                ->where('weekly_menu_id', $menuId)
                ->first();

            if ($item) {
                $item->update(collect($itemData)->except('id')->toArray());
            }
        }

        return true;
    }

    public function reorder(int $menuId, array $order): bool
    {
        foreach ($order as $position => $itemId) {
            $item = $this->model->where('id', $itemId)
                ->where('weekly_menu_id', $menuId)
                ->first();

            if ($item) {
                $item->update(['display_order' => $position + 1]);
            }
        }

        return true;
    }

    public function getDefaults(int $menuId, string $date): Collection
    {
        return $this->model->where('weekly_menu_id', $menuId)
            ->where('menu_date', $date)
            ->where('is_default', true)
            ->where('is_active', true)
            ->with(['mealCategory', 'meal'])
            ->orderBy('display_order', 'asc')
            ->get();
    }
}
