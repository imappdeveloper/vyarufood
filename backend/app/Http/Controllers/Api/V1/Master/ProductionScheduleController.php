<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Kitchen\StoreProductionScheduleRequest;
use App\Http\Requests\Kitchen\UpdateProductionScheduleRequest;
use App\Models\ProductionSchedule;
use App\Services\Kitchen\ProductionScheduleServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionScheduleController extends BaseController
{
    public function __construct(
        protected ProductionScheduleServiceInterface $scheduleService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', ProductionSchedule::class);

            $kitchenId = $request->input('kitchen_id');

            $filters = $request->only([
                'search', 'status', 'meal_type', 'production_date', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'production_date');
            $order = $request->input('order', 'desc');

            $schedules = $this->scheduleService->getPaginated((int) $kitchenId, $filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Kitchen\ProductionScheduleResource::collection($schedules),
                'Production schedules retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreProductionScheduleRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', ProductionSchedule::class);

            $schedule = $this->scheduleService->create($request->validated());

            return $this->createdResponse(
                $schedule,
                'Production schedule created successfully'
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
            $schedule = $this->scheduleService->findByUuid($uuid);

            if (! $schedule) {
                return $this->notFoundResponse('Production schedule not found');
            }

            $this->authorize('view', $schedule);

            return $this->successResponse(
                $schedule,
                'Production schedule retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateProductionScheduleRequest $request, string $uuid): JsonResponse
    {
        try {
            $schedule = $this->scheduleService->findByUuid($uuid);

            if (! $schedule) {
                return $this->notFoundResponse('Production schedule not found');
            }

            $this->authorize('update', $schedule);

            $schedule = $this->scheduleService->update($schedule, $request->validated());

            return $this->successResponse(
                $schedule,
                'Production schedule updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $schedule = $this->scheduleService->findByUuid($uuid);

            if (! $schedule) {
                return $this->notFoundResponse('Production schedule not found');
            }

            $this->authorize('delete', $schedule);

            $this->scheduleService->delete($schedule);

            return $this->successResponse(null, 'Production schedule deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function generatePlan(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'kitchen_id' => 'required|integer|exists:kitchens,id',
                'date' => 'required|date',
                'meal_types' => 'required|array|min:1',
                'meal_types.*' => 'string|in:breakfast,lunch,dinner,snack',
            ]);

            $count = $this->scheduleService->generateDailyPlan(
                (int) $request->input('kitchen_id'),
                $request->input('date'),
                $request->input('meal_types')
            );

            return $this->successResponse(['generated' => $count], "{$count} production schedules generated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function markCompleted(string $uuid): JsonResponse
    {
        try {
            $schedule = $this->scheduleService->findByUuid($uuid);

            if (! $schedule) {
                return $this->notFoundResponse('Production schedule not found');
            }

            $this->authorize('update', $schedule);

            $schedule = $this->scheduleService->markCompleted($schedule);

            return $this->successResponse(
                $schedule,
                'Production schedule marked as completed successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function stats(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'kitchen_id' => 'required|integer|exists:kitchens,id',
            ]);

            $stats = $this->scheduleService->getProductionStats((int) $request->input('kitchen_id'));

            return $this->successResponse($stats, 'Production statistics retrieved successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
