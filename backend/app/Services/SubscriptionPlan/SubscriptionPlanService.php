<?php

declare(strict_types=1);

namespace App\Services\SubscriptionPlan;

use App\DTOs\SubscriptionPlan\SubscriptionPlanDTO;
use App\Models\SubscriptionPlan;
use App\Repositories\SubscriptionPlan\SubscriptionPlanMealRepositoryInterface;
use App\Repositories\SubscriptionPlan\SubscriptionPlanRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class SubscriptionPlanService extends BaseService implements SubscriptionPlanServiceInterface
{
    protected string $moduleName = 'subscription_plan';

    public function __construct(
        protected SubscriptionPlanRepositoryInterface $planRepo,
        protected SubscriptionPlanMealRepositoryInterface $planMealRepo,
    ) {}

    public function getPaginatedPlans(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->planRepo->getPaginated($filters, $perPage);
    }

    public function getPlanById(int $id): ?SubscriptionPlan
    {
        return $this->planRepo->getById($id);
    }

    public function getPlanByUuid(string $uuid): ?SubscriptionPlan
    {
        return $this->planRepo->getByUuid($uuid);
    }

    public function createPlan(SubscriptionPlanDTO $dto, array $meals = []): SubscriptionPlan
    {
        return $this->transaction(function () use ($dto, $meals) {
            $existingByCode = $this->planRepo->getPaginated(['search' => $dto->planCode], 1);
            $duplicateCode = $existingByCode->getCollection()->firstWhere('plan_code', $dto->planCode);
            if ($duplicateCode) {
                throw new \RuntimeException('A plan with this plan code already exists.');
            }

            $existingByName = $this->planRepo->getPaginated(['search' => $dto->planName], 1);
            $duplicateName = $existingByName->getCollection()->firstWhere('plan_name', $dto->planName);
            if ($duplicateName) {
                throw new \RuntimeException('A plan with this plan name already exists.');
            }

            $createdBy = auth()->guard('admin')->id();

            $data = $dto->toArray();
            $data['slug'] = Str::slug($dto->planName);
            $data['created_by'] = $createdBy;
            $data['updated_by'] = $createdBy;

            $plan = $this->planRepo->create($data);

            if (! empty($meals)) {
                $this->planMealRepo->syncPlanMeals($plan->id, $meals);
            }

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan created', ['plan_id' => $plan->id, 'plan_name' => $plan->plan_name]);
            $this->logActivity('subscription_plan_created', $plan);

            return $plan;
        });
    }

    public function updatePlan(int $id, SubscriptionPlanDTO $dto, array $meals = []): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($id, $dto, $meals) {
            $existing = $this->planRepo->getById($id);

            if (! $existing) {
                return null;
            }

            if ($existing->status !== 'draft') {
                throw new \RuntimeException('Cannot edit a plan that is not in draft status.');
            }

            if ($dto->planCode) {
                $existingByCode = $this->planRepo->getPaginated(['search' => $dto->planCode], 1);
                $duplicateCode = $existingByCode->getCollection()->first(function ($plan) use ($id, $dto) {
                    return $plan->plan_code === $dto->planCode && $plan->id !== $id;
                });
                if ($duplicateCode) {
                    throw new \RuntimeException('A plan with this plan code already exists.');
                }
            }

            if ($dto->planName) {
                $existingByName = $this->planRepo->getPaginated(['search' => $dto->planName], 1);
                $duplicateName = $existingByName->getCollection()->first(function ($plan) use ($id, $dto) {
                    return $plan->plan_name === $dto->planName && $plan->id !== $id;
                });
                if ($duplicateName) {
                    throw new \RuntimeException('A plan with this plan name already exists.');
                }
            }

            $updatedBy = auth()->guard('admin')->id();

            $data = collect($dto->toArray())->filter()->except(['id', 'uuid', 'created_by'])->toArray();
            $data['updated_by'] = $updatedBy;

            if (! empty($data['plan_name'])) {
                $data['slug'] = Str::slug($dto->planName);
            }

            $plan = $this->planRepo->update($id, $data);

            if (! empty($meals)) {
                $this->planMealRepo->syncPlanMeals($plan->id, $meals);
            }

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan updated', ['plan_id' => $id]);
            $this->logActivity('subscription_plan_updated', $plan);

            return $plan;
        });
    }

    public function deletePlan(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $existing = $this->planRepo->getById($id);

            if (! $existing) {
                return false;
            }

            if ($existing->status !== 'draft') {
                throw new \RuntimeException('Cannot delete a plan with active subscribers. Deactivate it first.');
            }

            $result = $this->planRepo->delete($id);

            if ($result) {
                CacheManager::flush('subscription_plan');
                $this->logInfo('Subscription plan deleted', ['plan_id' => $id]);
                $this->logActivity('subscription_plan_deleted', $existing);
            }

            return $result;
        });
    }

    public function restorePlan(int $id): bool
    {
        $result = $this->planRepo->restore($id);

        if ($result) {
            CacheManager::flush('subscription_plan');
            $this->logInfo('Subscription plan restored', ['plan_id' => $id]);
        }

        return $result;
    }

    public function forceDeletePlan(int $id): bool
    {
        $result = $this->planRepo->forceDelete($id);

        if ($result) {
            CacheManager::flush('subscription_plan');
            $this->logInfo('Subscription plan force deleted', ['plan_id' => $id]);
        }

        return $result;
    }

    public function activatePlan(SubscriptionPlan $plan): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($plan) {
            $updated = $this->planRepo->update($plan->id, [
                'status' => 'active',
            ]);

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan activated', ['plan_id' => $plan->id]);
            $this->logActivity('subscription_plan_activated', $updated);

            return $updated;
        });
    }

    public function deactivatePlan(SubscriptionPlan $plan): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($plan) {
            $updated = $this->planRepo->update($plan->id, [
                'status' => 'inactive',
            ]);

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan deactivated', ['plan_id' => $plan->id]);
            $this->logActivity('subscription_plan_deactivated', $updated);

            return $updated;
        });
    }

    public function togglePopular(SubscriptionPlan $plan): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($plan) {
            $updated = $this->planRepo->update($plan->id, [
                'is_popular' => ! $plan->is_popular,
            ]);

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan popularity toggled', ['plan_id' => $plan->id, 'is_popular' => $updated->is_popular]);
            $this->logActivity('subscription_plan_popularity_toggled', $updated);

            return $updated;
        });
    }

    public function toggleRecommended(SubscriptionPlan $plan): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($plan) {
            $updated = $this->planRepo->update($plan->id, [
                'is_recommended' => ! $plan->is_recommended,
            ]);

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan recommendation toggled', ['plan_id' => $plan->id, 'is_recommended' => $updated->is_recommended]);
            $this->logActivity('subscription_plan_recommendation_toggled', $updated);

            return $updated;
        });
    }

    public function duplicatePlan(int $id): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($id) {
            $source = $this->planRepo->getById($id);

            if (! $source) {
                return null;
            }

            $userId = auth()->guard('admin')->id();

            $data = $source->toArray();
            unset($data['id'], $data['uuid'], $data['created_at'], $data['updated_at'], $data['deleted_at']);
            $data['plan_name'] = $source->plan_name . ' (Copy)';
            $data['plan_code'] = $source->plan_code . '-copy-' . Str::random(4);
            $data['slug'] = Str::slug($data['plan_name']);
            $data['status'] = 'draft';
            $data['created_by'] = $userId;
            $data['updated_by'] = $userId;

            $plan = $this->planRepo->create($data);

            $sourceMeals = $this->planMealRepo->getByPlanId($source->id);
            if ($sourceMeals->isNotEmpty()) {
                $newMeals = $sourceMeals->map(function ($meal) use ($plan) {
                    $mealData = $meal->toArray();
                    unset($mealData['id'], $mealData['uuid'], $mealData['created_at'], $mealData['updated_at']);
                    $mealData['subscription_plan_id'] = $plan->id;
                    return $mealData;
                })->toArray();

                $this->planMealRepo->syncPlanMeals($plan->id, $newMeals);
            }

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan duplicated', ['source_id' => $id, 'new_id' => $plan->id]);
            $this->logActivity('subscription_plan_duplicated', $plan);

            return $plan->fresh();
        });
    }

    public function setStatus(int $id, string $status): ?SubscriptionPlan
    {
        return $this->transaction(function () use ($id, $status) {
            $existing = $this->planRepo->getById($id);

            if (! $existing) {
                return null;
            }

            $plan = $this->planRepo->update($id, ['status' => $status]);

            CacheManager::flush('subscription_plan');

            $this->logInfo('Subscription plan status changed', ['plan_id' => $id, 'status' => $status]);
            $this->logActivity('subscription_plan_status_changed', $plan);

            return $plan;
        });
    }

    public function importPlans(\Illuminate\Http\UploadedFile $file): array
    {
        $imported = 0;
        $errors = [];
        $rows = [];

        if ($file->getClientOriginalExtension() === 'csv') {
            $handle = fopen($file->getPathname(), 'r');
            $headers = fgetcsv($handle);
            while (($row = fgetcsv($handle)) !== false) {
                $rows[] = array_combine($headers, $row);
            }
            fclose($handle);
        } else {
            throw new \RuntimeException('Excel import not yet implemented. Please use CSV.');
        }

        foreach ($rows as $index => $row) {
            try {
                $dto = \App\DTOs\SubscriptionPlan\SubscriptionPlanDTO::fromArray($row);
                $this->createPlan($dto);
                $imported++;
            } catch (\Exception $e) {
                $errors[] = ['row' => $index + 2, 'error' => $e->getMessage()];
            }
        }

        return ['imported' => $imported, 'errors' => $errors];
    }

    public function exportPlans(array $filters = []): string
    {
        $plans = $this->planRepo->getAll();
        $headers = ['Plan Code', 'Plan Name', 'Plan Type', 'Billing Cycle', 'Duration Days', 'Price', 'Offer Price', 'Status'];
        $rows = [];
        foreach ($plans as $plan) {
            $rows[] = [$plan->plan_code, $plan->plan_name, $plan->plan_type, $plan->billing_cycle, $plan->duration_days, $plan->price, $plan->offer_price, $plan->status];
        }

        $filename = 'subscription_plans_' . now()->format('Y-m-d_His') . '.csv';
        $path = 'exports/' . $filename;
        $handle = fopen(storage_path('app/' . $path), 'w');
        fputcsv($handle, $headers);
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);

        return $path;
    }

    public function getPlanStats(?int $kitchenId = null, ?int $mealCategoryId = null): array
    {
        return $this->planRepo->getStats();
    }
}
