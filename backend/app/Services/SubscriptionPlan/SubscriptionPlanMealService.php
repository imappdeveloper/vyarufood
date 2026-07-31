<?php

declare(strict_types=1);

namespace App\Services\SubscriptionPlan;

use App\Models\SubscriptionPlanMeal;
use App\Repositories\SubscriptionPlan\SubscriptionPlanMealRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionPlanMealService extends BaseService
{
    protected string $moduleName = 'subscription_plan_meal';

    public function __construct(
        protected SubscriptionPlanMealRepositoryInterface $planMealRepo,
    ) {}

    public function getByPlanId(int $planId): Collection
    {
        return $this->planMealRepo->getByPlanId($planId);
    }

    public function create(array $data): SubscriptionPlanMeal
    {
        return $this->transaction(function () use ($data) {
            $meal = $this->planMealRepo->create($data);

            $this->logInfo('Subscription plan meal created', ['meal_id' => $meal->id]);

            return $meal;
        });
    }

    public function update(int $id, array $data): ?SubscriptionPlanMeal
    {
        return $this->transaction(function () use ($id, $data) {
            $meal = $this->planMealRepo->update($id, $data);

            if ($meal) {
                $this->logInfo('Subscription plan meal updated', ['meal_id' => $id]);
            }

            return $meal;
        });
    }

    public function delete(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->planMealRepo->delete($id);

            if ($result) {
                $this->logInfo('Subscription plan meal deleted', ['meal_id' => $id]);
            }

            return $result;
        });
    }

    public function syncPlanMeals(int $planId, array $meals): void
    {
        $this->transaction(function () use ($planId, $meals) {
            $this->planMealRepo->syncPlanMeals($planId, $meals);

            $this->logInfo('Subscription plan meals synced', ['plan_id' => $planId, 'count' => count($meals)]);
        });
    }
}
