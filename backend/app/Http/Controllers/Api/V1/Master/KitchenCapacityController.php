<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\Kitchen\StoreKitchenCapacityRequest;
use App\Http\Requests\Kitchen\UpdateKitchenCapacityRequest;
use App\Models\KitchenCapacity;
use App\Services\Kitchen\KitchenCapacityServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KitchenCapacityController extends BaseController
{
    public function __construct(
        protected KitchenCapacityServiceInterface $capacityService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', KitchenCapacity::class);

            $kitchenId = $request->input('kitchen_id');

            $filters = $request->only([
                'search', 'status', 'capacity_date', 'date_from', 'date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'capacity_date');
            $order = $request->input('order', 'asc');

            $capacities = $this->capacityService->getPaginated((int) $kitchenId, $filters, $perPage, $sort, $order);

            return $this->paginatedResponse(
                \App\Http\Resources\Kitchen\KitchenCapacityResource::collection($capacities),
                'Kitchen capacities retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreKitchenCapacityRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', KitchenCapacity::class);

            $capacity = $this->capacityService->create($request->validated());

            return $this->createdResponse(
                $capacity,
                'Kitchen capacity created successfully'
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
            $capacity = $this->capacityService->findByUuid($uuid);

            if (! $capacity) {
                return $this->notFoundResponse('Kitchen capacity not found');
            }

            $this->authorize('view', $capacity);

            return $this->successResponse(
                $capacity,
                'Kitchen capacity retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateKitchenCapacityRequest $request, string $uuid): JsonResponse
    {
        try {
            $capacity = $this->capacityService->findByUuid($uuid);

            if (! $capacity) {
                return $this->notFoundResponse('Kitchen capacity not found');
            }

            $this->authorize('update', $capacity);

            $capacity = $this->capacityService->update($capacity, $request->validated());

            return $this->successResponse(
                $capacity,
                'Kitchen capacity updated successfully'
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
            $capacity = $this->capacityService->findByUuid($uuid);

            if (! $capacity) {
                return $this->notFoundResponse('Kitchen capacity not found');
            }

            $this->authorize('delete', $capacity);

            $this->capacityService->delete($capacity);

            return $this->successResponse(null, 'Kitchen capacity deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'kitchen_id' => 'required|integer|exists:kitchens,id',
                'capacities' => 'required|array|min:1',
                'capacities.*.capacity_date' => 'required|date',
                'capacities.*.total_capacity' => 'required|integer|min:0',
                'capacities.*.max_orders' => 'nullable|integer|min:0',
                'capacities.*.status' => 'nullable|string|in:active,inactive',
            ]);

            $count = $this->capacityService->bulkUpdateCapacity(
                (int) $request->input('kitchen_id'),
                $request->input('capacities')
            );

            return $this->successResponse(['updated' => $count], "{$count} capacities updated successfully");
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
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

            $stats = $this->capacityService->getCapacityStats((int) $request->input('kitchen_id'));

            return $this->successResponse($stats, 'Kitchen capacity statistics retrieved successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
