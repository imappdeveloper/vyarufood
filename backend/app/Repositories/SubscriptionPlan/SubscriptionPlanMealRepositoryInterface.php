<?php

declare(strict_types=1);

namespace App\Repositories\SubscriptionPlan;

use App\Models\SubscriptionPlanMeal;
use Illuminate\Database\Eloquent\Collection;

interface SubscriptionPlanMealRepositoryInterface
{
    public function getByPlanId(int $planId): Collection;
    public function create(array $data): SubscriptionPlanMeal;
    public function update(int $id, array $data): ?SubscriptionPlanMeal;
    public function delete(int $id): bool;
    public function syncPlanMeals(int $planId, array $meals): void;
}
