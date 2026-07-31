<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Requests\SubscriptionPlan\StoreSubscriptionPlanRequest;
use App\Http\Requests\SubscriptionPlan\UpdateSubscriptionPlanRequest;
use App\Http\Resources\SubscriptionPlan\SubscriptionPlanResource;
use App\Models\SubscriptionPlan;
use App\Services\SubscriptionPlan\SubscriptionPlanServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SubscriptionPlanController extends BaseController
{
    public function __construct(
        private SubscriptionPlanServiceInterface $planService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', SubscriptionPlan::class);

            $filters = $request->only([
                'search', 'plan_type', 'billing_cycle', 'meal_category_id',
                'kitchen_id', 'status', 'is_popular', 'is_recommended',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $plans = $this->planService->getPaginatedPlans($filters, $perPage);

            return $this->paginatedResponse(
                SubscriptionPlanResource::collection($plans),
                'Subscription plans retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreSubscriptionPlanRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', SubscriptionPlan::class);

            $validated = $request->validated();
            $meals = $validated['meals'] ?? [];
            unset($validated['meals']);

            $dto = \App\DTOs\SubscriptionPlan\SubscriptionPlanDTO::fromArray($validated);
            $plan = $this->planService->createPlan($dto, $meals);

            return $this->createdResponse(
                new SubscriptionPlanResource($plan->load('kitchen', 'mealCategory', 'planMeals')),
                'Subscription plan created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $plan);

            $plan->load('kitchen', 'mealCategory', 'planMeals.mealCategory', 'planMeals.mealType', 'planMeals.meal', 'createdBy', 'updatedBy');

            return $this->successResponse(
                new SubscriptionPlanResource($plan),
                'Subscription plan retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateSubscriptionPlanRequest $request, string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $plan);

            $validated = $request->validated();
            $meals = $validated['meals'] ?? [];
            unset($validated['meals']);

            $dto = \App\DTOs\SubscriptionPlan\SubscriptionPlanDTO::fromArray($validated);
            $plan = $this->planService->updatePlan($plan->id, $dto, $meals);

            return $this->successResponse(
                new SubscriptionPlanResource($plan->load('kitchen', 'mealCategory', 'planMeals')),
                'Subscription plan updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $plan);

            $this->planService->deletePlan($plan->id);

            return $this->successResponse(null, 'Subscription plan deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $plan);

            $result = $this->planService->restorePlan($plan->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore subscription plan', 400);
            }

            return $this->successResponse(null, 'Subscription plan restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $plan);

            $this->planService->forceDeletePlan($plan->id);

            return $this->successResponse(null, 'Subscription plan permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function setStatus(Request $request, string $uuid): JsonResponse
    {
        try {
            $request->validate([
                'status' => ['required', 'string', 'in:active,inactive,draft'],
            ]);

            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $plan);

            $plan = $this->planService->setStatus($plan->id, $request->input('status'));

            return $this->successResponse(
                new SubscriptionPlanResource($plan->load('kitchen', 'mealCategory')),
                'Subscription plan status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function togglePopular(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $plan);

            $plan = $this->planService->togglePopular($plan->id);

            return $this->successResponse(
                new SubscriptionPlanResource($plan->load('kitchen', 'mealCategory')),
                'Subscription plan popularity updated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function toggleRecommended(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $plan);

            $plan = $this->planService->toggleRecommended($plan->id);

            return $this->successResponse(
                new SubscriptionPlanResource($plan->load('kitchen', 'mealCategory')),
                'Subscription plan recommendation updated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function duplicate(string $uuid): JsonResponse
    {
        try {
            $plan = SubscriptionPlan::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('create', SubscriptionPlan::class);

            $duplicated = $this->planService->duplicatePlan($plan->id);

            if (! $duplicated) {
                return $this->errorResponse('Failed to duplicate subscription plan', 400);
            }

            return $this->createdResponse(
                new SubscriptionPlanResource($duplicated->load('kitchen', 'mealCategory', 'planMeals')),
                'Subscription plan duplicated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Subscription plan not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function import(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => ['required', 'file', 'mimes:csv,xlsx,xls', 'max:' . AppConstants::MAX_FILE_SIZE],
            ]);

            $file = $request->file('file');
            $results = $this->planService->importPlans($file);

            return $this->successResponse($results, 'Subscription plans imported successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', SubscriptionPlan::class);

            $filters = $request->only([
                'plan_type', 'billing_cycle', 'meal_category_id',
                'kitchen_id', 'status', 'is_popular', 'is_recommended',
            ]);

            $filePath = $this->planService->exportPlans($filters);

            return $this->successResponse(
                ['download_url' => Storage::temporaryUrl($filePath, now()->addHours(1))],
                'Subscription plans exported successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getStats(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', SubscriptionPlan::class);

            $kitchenId = $request->input('kitchen_id') ? (int) $request->input('kitchen_id') : null;
            $mealCategoryId = $request->input('meal_category_id') ? (int) $request->input('meal_category_id') : null;
            $stats = $this->planService->getPlanStats($kitchenId, $mealCategoryId);

            return $this->successResponse($stats, 'Subscription plan statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
