<?php

declare(strict_types=1);

namespace App\Repositories\SubscriptionPlan;

use App\Models\SubscriptionPlanMeal;
use App\Support\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionPlanMealRepository extends BaseRepository implements SubscriptionPlanMealRepositoryInterface
{
    protected function model(): SubscriptionPlanMeal
    {
        return new SubscriptionPlanMeal;
    }

    public function getByPlanId(int $planId): Collection
    {
        return $this->model->where('subscription_plan_id', $planId)
            ->with(['meal', 'mealCategory', 'mealType'])
            ->get();
    }

    public function create(array $data): SubscriptionPlanMeal
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?SubscriptionPlanMeal
    {
        $meal = $this->model->find($id);

        if (! $meal) {
            return null;
        }

        $meal->update($data);

        return $meal->fresh();
    }

    public function delete(int $id): bool
    {
        $meal = $this->model->find($id);

        if (! $meal) {
            return false;
        }

        return $meal->delete();
    }

    public function syncPlanMeals(int $planId, array $meals): void
    {
        $this->model->where('subscription_plan_id', $planId)->delete();

        foreach ($meals as $meal) {
            $this->model->create(array_merge(
                $meal,
                ['subscription_plan_id' => $planId]
            ));
        }
    }
}
