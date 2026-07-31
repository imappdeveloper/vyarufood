<?php

declare(strict_types=1);

namespace App\Repositories\WeeklyMenu;

use App\Models\WeeklyMenu;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class WeeklyMenuRepository extends BaseRepository implements WeeklyMenuRepositoryInterface
{
    protected function model(): WeeklyMenu
    {
        return new WeeklyMenu;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['kitchen', 'publishedBy', 'createdBy']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', $filters['kitchen_id']);
        }

        if (! empty($filters['week_start_date'])) {
            $query->where('week_start_date', $filters['week_start_date']);
        }

        if (! empty($filters['week_end_date'])) {
            $query->where('week_end_date', $filters['week_end_date']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('week_start_date', 'desc')->paginate($perPage);
    }

    public function getActive(): Collection
    {
        return $this->model->query()
            ->where('status', '!=', 'archived')
            ->with(['kitchen', 'items'])
            ->orderBy('week_start_date', 'desc')
            ->get();
    }

    public function getById(int $id): ?WeeklyMenu
    {
        return $this->model->with(['kitchen', 'publishedBy', 'createdBy', 'items', 'items.meal', 'items.mealCategory'])
            ->find($id);
    }

    public function getByUuid(string $uuid): ?WeeklyMenu
    {
        return $this->model->where('uuid', $uuid)
            ->with(['kitchen', 'publishedBy', 'createdBy', 'items', 'items.meal', 'items.mealCategory'])
            ->first();
    }

    public function getByWeek(string $weekStartDate, ?int $kitchenId = 1): ?WeeklyMenu
    {
        return $this->model->where('week_start_date', $weekStartDate)
            ->where('kitchen_id', $kitchenId ?? 1)
            ->with(['kitchen', 'items', 'items.meal', 'items.mealCategory'])
            ->first();
    }

    public function getByDateRange(string $startDate, string $endDate, ?int $kitchenId = 1): Collection
    {
        return $this->model->where('kitchen_id', $kitchenId ?? 1)
            ->where('week_start_date', '>=', $startDate)
            ->where('week_end_date', '<=', $endDate)
            ->with(['kitchen', 'items'])
            ->orderBy('week_start_date', 'asc')
            ->get();
    }

    public function getPublished(?int $kitchenId = 1): Collection
    {
        return $this->model->where('status', 'published')
            ->where('kitchen_id', $kitchenId ?? 1)
            ->with(['kitchen', 'items', 'items.meal', 'items.mealCategory'])
            ->orderBy('week_start_date', 'desc')
            ->get();
    }

    public function getUpcoming(?int $kitchenId = 1): Collection
    {
        return $this->model->where('status', 'published')
            ->where('kitchen_id', $kitchenId ?? 1)
            ->where('week_start_date', '>=', now()->toDateString())
            ->with(['kitchen', 'items', 'items.meal', 'items.mealCategory'])
            ->orderBy('week_start_date', 'asc')
            ->get();
    }

    public function create(array $data): WeeklyMenu
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?WeeklyMenu
    {
        $menu = $this->model->find($id);

        if (! $menu) {
            return null;
        }

        $menu->update($data);

        return $menu->fresh();
    }

    public function delete(int $id): bool
    {
        $menu = $this->model->find($id);

        if (! $menu) {
            return false;
        }

        return $menu->delete();
    }

    public function restore(int $id): bool
    {
        $menu = $this->model->withTrashed()->find($id);

        if (! $menu) {
            return false;
        }

        return $menu->restore();
    }

    public function getStats(?int $kitchenId = 1): array
    {
        $query = $this->model->query()->where('kitchen_id', $kitchenId ?? 1);

        return [
            'total' => (clone $query)->count(),
            'draft' => (clone $query)->where('status', 'draft')->count(),
            'published' => (clone $query)->where('status', 'published')->count(),
            'archived' => (clone $query)->where('status', 'archived')->count(),
            'upcoming' => (clone $query)->where('status', 'published')
                ->where('week_start_date', '>=', now()->toDateString())->count(),
        ];
    }
}
