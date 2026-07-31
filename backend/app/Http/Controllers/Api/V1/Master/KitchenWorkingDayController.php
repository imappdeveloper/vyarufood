<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Kitchen\StoreKitchenWorkingDayRequest;
use App\Http\Requests\Kitchen\UpdateKitchenWorkingDayRequest;
use App\Models\KitchenWorkingDay;
use App\Services\Kitchen\KitchenWorkingDayServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KitchenWorkingDayController extends BaseController
{
    public function __construct(
        protected KitchenWorkingDayServiceInterface $workingDayService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', KitchenWorkingDay::class);

            $kitchenId = $request->input('kitchen_id');

            $filters = $request->only([
                'search', 'status', 'is_working', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'day_of_week');
            $order = $request->input('order', 'asc');

            $workingDays = $this->workingDayService->getPaginated((int) $kitchenId, $filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Kitchen\KitchenWorkingDayResource::collection($workingDays),
                'Kitchen working days retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreKitchenWorkingDayRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', KitchenWorkingDay::class);

            $workingDay = $this->workingDayService->create($request->validated());

            return $this->createdResponse(
                $workingDay,
                'Kitchen working day created successfully'
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
            $workingDay = $this->workingDayService->findByUuid($uuid);

            if (! $workingDay) {
                return $this->notFoundResponse('Kitchen working day not found');
            }

            $this->authorize('view', $workingDay);

            return $this->successResponse(
                $workingDay,
                'Kitchen working day retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateKitchenWorkingDayRequest $request, string $uuid): JsonResponse
    {
        try {
            $workingDay = $this->workingDayService->findByUuid($uuid);

            if (! $workingDay) {
                return $this->notFoundResponse('Kitchen working day not found');
            }

            $this->authorize('update', $workingDay);

            $workingDay = $this->workingDayService->update($workingDay, $request->validated());

            return $this->successResponse(
                $workingDay,
                'Kitchen working day updated successfully'
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
            $workingDay = $this->workingDayService->findByUuid($uuid);

            if (! $workingDay) {
                return $this->notFoundResponse('Kitchen working day not found');
            }

            $this->authorize('delete', $workingDay);

            $this->workingDayService->delete($workingDay);

            return $this->successResponse(null, 'Kitchen working day deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'kitchen_id' => 'required|integer|exists:kitchens,id',
                'days' => 'required|array|min:1',
                'days.*.day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
                'days.*.is_working' => 'required|boolean',
                'days.*.open_time' => 'nullable|string',
                'days.*.close_time' => 'nullable|string',
                'days.*.break_start_time' => 'nullable|string',
                'days.*.break_end_time' => 'nullable|string',
            ]);

            $count = $this->workingDayService->bulkUpdate(
                (int) $request->input('kitchen_id'),
                $request->input('days')
            );

            return $this->successResponse(['updated' => $count], "{$count} working days updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getDefaultSchedule(): JsonResponse
    {
        try {
            $schedule = $this->workingDayService->getDefaultSchedule();

            return $this->successResponse($schedule, 'Default schedule retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
