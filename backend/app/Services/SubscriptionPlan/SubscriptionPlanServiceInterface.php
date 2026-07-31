<?php

declare(strict_types=1);

namespace App\Services\SubscriptionPlan;

use App\DTOs\SubscriptionPlan\SubscriptionPlanDTO;
use App\Models\SubscriptionPlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SubscriptionPlanServiceInterface
{
    public function getPaginatedPlans(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getPlanById(int $id): ?SubscriptionPlan;
    public function getPlanByUuid(string $uuid): ?SubscriptionPlan;
    public function createPlan(SubscriptionPlanDTO $dto, array $meals = []): SubscriptionPlan;
    public function updatePlan(int $id, SubscriptionPlanDTO $dto, array $meals = []): ?SubscriptionPlan;
    public function deletePlan(int $id): bool;
    public function restorePlan(int $id): bool;
    public function forceDeletePlan(int $id): bool;
    public function activatePlan(SubscriptionPlan $plan): ?SubscriptionPlan;
    public function deactivatePlan(SubscriptionPlan $plan): ?SubscriptionPlan;
    public function togglePopular(SubscriptionPlan $plan): ?SubscriptionPlan;
    public function toggleRecommended(SubscriptionPlan $plan): ?SubscriptionPlan;
    public function duplicatePlan(int $id): ?SubscriptionPlan;
    public function setStatus(int $id, string $status): ?SubscriptionPlan;
    public function importPlans(\Illuminate\Http\UploadedFile $file): array;
    public function exportPlans(array $filters = []): string;
    public function getPlanStats(?int $kitchenId = null, ?int $mealCategoryId = null): array;
}
