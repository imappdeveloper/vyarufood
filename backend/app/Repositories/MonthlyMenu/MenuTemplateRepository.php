<?php

declare(strict_types=1);

namespace App\Repositories\MonthlyMenu;

use App\Models\MenuTemplate;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MenuTemplateRepository extends BaseRepository implements MenuTemplateRepositoryInterface
{
    protected function model(): MenuTemplate
    {
        return new MenuTemplate;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['kitchen', 'items']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('template_name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', $filters['kitchen_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAll(?int $kitchenId = 1): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId ?? 1)
            ->with(['kitchen', 'items', 'items.mealCategory', 'items.meal', 'items.mealType'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(int $id): ?MenuTemplate
    {
        return $this->model->with(['kitchen', 'items', 'items.mealCategory', 'items.meal', 'items.mealType'])
            ->find($id);
    }

    public function getByUuid(string $uuid): ?MenuTemplate
    {
        return $this->model->where('uuid', $uuid)
            ->with(['kitchen', 'items', 'items.mealCategory', 'items.meal', 'items.mealType'])
            ->first();
    }

    public function getDefault(?int $kitchenId = 1): ?MenuTemplate
    {
        return $this->model->where('is_default', true)
            ->where('kitchen_id', $kitchenId ?? 1)
            ->with(['items'])
            ->first();
    }

    public function create(array $data): MenuTemplate
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?MenuTemplate
    {
        $template = $this->model->find($id);

        if (! $template) {
            return null;
        }

        $template->update($data);

        return $template->fresh();
    }

    public function delete(int $id): bool
    {
        $template = $this->model->find($id);

        if (! $template) {
            return false;
        }

        return $template->delete();
    }

    public function restore(int $id): bool
    {
        $template = $this->model->withTrashed()->find($id);

        if (! $template) {
            return false;
        }

        return $template->restore();
    }
}
