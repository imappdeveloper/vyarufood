<?php

declare(strict_types=1);

namespace App\Repositories\MonthlyMenu;

use App\Models\MonthlyMenu;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MonthlyMenuRepository extends BaseRepository implements MonthlyMenuRepositoryInterface
{
    protected function model(): MonthlyMenu
    {
        return new MonthlyMenu;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['kitchen', 'publishedBy', 'createdBy', 'approvedBy']);

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

        if (! empty($filters['month'])) {
            $query->where('month', $filters['month']);
        }

        if (! empty($filters['year'])) {
            $query->where('year', $filters['year']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('year', 'desc')->orderBy('month', 'desc')->paginate($perPage);
    }

    public function getActive(): Collection
    {
        return $this->model->query()
            ->where('status', '!=', 'archived')
            ->with(['kitchen', 'items'])
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
    }

    public function getById(int $id): ?MonthlyMenu
    {
        return $this->model->with(['kitchen', 'publishedBy', 'createdBy', 'approvedBy', 'items', 'items.meal', 'items.mealCategory', 'items.mealType'])
            ->find($id);
    }

    public function getByUuid(string $uuid): ?MonthlyMenu
    {
        return $this->model->where('uuid', $uuid)
            ->with(['kitchen', 'publishedBy', 'createdBy', 'approvedBy', 'items', 'items.meal', 'items.mealCategory', 'items.mealType'])
            ->first();
    }

    public function getByMonthYear(int $month, int $year, ?int $kitchenId = 1): ?MonthlyMenu
    {
        return $this->model->where('month', $month)
            ->where('year', $year)
            ->where('kitchen_id', $kitchenId ?? 1)
            ->with(['kitchen', 'items', 'items.meal', 'items.mealCategory'])
            ->first();
    }

    public function getPublished(?int $kitchenId = 1): Collection
    {
        return $this->model->where('status', 'published')
            ->where('kitchen_id', $kitchenId ?? 1)
            ->with(['kitchen', 'items', 'items.meal', 'items.mealCategory'])
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
    }

    public function create(array $data): MonthlyMenu
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?MonthlyMenu
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
            'approved' => (clone $query)->where('status', 'approved')->count(),
            'archived' => (clone $query)->where('status', 'archived')->count(),
        ];
    }
}
