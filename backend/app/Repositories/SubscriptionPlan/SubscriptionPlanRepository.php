<?php

declare(strict_types=1);

namespace App\Repositories\SubscriptionPlan;

use App\Models\SubscriptionPlan;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionPlanRepository extends BaseRepository implements SubscriptionPlanRepositoryInterface
{
    protected function model(): SubscriptionPlan
    {
        return new SubscriptionPlan;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['mealCategory', 'kitchen']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('plan_name', 'LIKE', "%{$search}%")
                  ->orWhere('plan_code', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['plan_type'])) {
            $query->where('plan_type', $filters['plan_type']);
        }

        if (! empty($filters['billing_cycle'])) {
            $query->where('billing_cycle', $filters['billing_cycle']);
        }

        if (! empty($filters['meal_category_id'])) {
            $query->where('meal_category_id', $filters['meal_category_id']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', $filters['kitchen_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_popular'])) {
            $query->where('is_popular', $filters['is_popular']);
        }

        if (isset($filters['is_recommended'])) {
            $query->where('is_recommended', $filters['is_recommended']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('display_order', 'asc')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->query()
            ->where('status', 'active')
            ->with(['mealCategory', 'kitchen'])
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(int $id): ?SubscriptionPlan
    {
        return $this->model->with([
            'mealCategory',
            'kitchen',
            'planMeals.meal',
            'planMeals.mealCategory',
            'planMeals.mealType',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?SubscriptionPlan
    {
        return $this->model->where('uuid', $uuid)
            ->with([
                'mealCategory',
                'kitchen',
                'planMeals.meal',
                'planMeals.mealCategory',
                'planMeals.mealType',
            ])
            ->first();
    }

    public function create(array $data): SubscriptionPlan
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?SubscriptionPlan
    {
        $plan = $this->model->find($id);

        if (! $plan) {
            return null;
        }

        $plan->update($data);

        return $plan->fresh();
    }

    public function delete(int $id): bool
    {
        $plan = $this->model->find($id);

        if (! $plan) {
            return false;
        }

        return $plan->delete();
    }

    public function restore(int $id): bool
    {
        $plan = $this->model->withTrashed()->find($id);

        if (! $plan) {
            return false;
        }

        return $plan->restore();
    }

    public function forceDelete(int $id): bool
    {
        $plan = $this->model->withTrashed()->find($id);

        if (! $plan) {
            return false;
        }

        return $plan->forceDelete();
    }

    public function getStats(): array
    {
        $query = $this->model->query();

        return [
            'total' => (clone $query)->count(),
            'active' => (clone $query)->where('status', 'active')->count(),
            'inactive' => (clone $query)->where('status', 'inactive')->count(),
            'draft' => (clone $query)->where('status', 'draft')->count(),
            'popular' => (clone $query)->where('is_popular', true)->count(),
            'recommended' => (clone $query)->where('is_recommended', true)->count(),
        ];
    }
}
