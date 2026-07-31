<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Master;

use App\Support\BaseController;
use App\Http\Requests\DeliveryZone\StoreDeliverySlotRequest;
use App\Http\Requests\DeliveryZone\UpdateDeliverySlotRequest;
use App\Models\Master\DeliverySlot;
use App\Services\DeliveryZone\DeliverySlotServiceInterface;
use App\Constants\AppConstants;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliverySlotController extends BaseController
{
    public function __construct(
        protected DeliverySlotServiceInterface $deliverySlotService,
    ) {}

    public function index(Request $request, string $deliveryZone): JsonResponse
    {
        try {
            $this->authorize('viewAny', DeliverySlot::class);

            $zone = \App\Models\Master\DeliveryZone::where('uuid', $deliveryZone)->firstOrFail();

            $filters = $request->only(['search', 'status', 'delivery_zone_id', 'day_of_week', 'is_available', 'date_from', 'date_to']);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);
            $sort = $request->input('sort', 'start_time');
            $order = $request->input('order', 'asc');

            $slots = $this->deliverySlotService->getPaginated($filters, $perPage, $sort, $order, $zone->id);

            return $this->paginatedResponse(
                \App\Http\Resources\DeliveryZone\DeliverySlotResource::collection($slots),
                'Delivery slots retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreDeliverySlotRequest $request, string $deliveryZone): JsonResponse
    {
        try {
            $this->authorize('create', DeliverySlot::class);

            $zone = \App\Models\Master\DeliveryZone::where('uuid', $deliveryZone)->firstOrFail();

            $data = $request->validated();
            $data['delivery_zone_id'] = $zone->id;

            $slot = $this->deliverySlotService->create($data);

            return $this->createdResponse(
                new \App\Http\Resources\DeliveryZone\DeliverySlotResource($slot->load(['deliveryZone'])),
                'Delivery slot created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $deliveryZone, string $slot): JsonResponse
    {
        try {
            $deliverySlot = \App\Models\Master\DeliverySlot::where('uuid', $slot)->firstOrFail();
            $this->authorize('view', $deliverySlot);

            return $this->successResponse(
                new \App\Http\Resources\DeliveryZone\DeliverySlotResource($deliverySlot->load(['deliveryZone'])),
                'Delivery slot retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery slot not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateDeliverySlotRequest $request, string $deliveryZone, string $slot): JsonResponse
    {
        try {
            $deliverySlot = \App\Models\Master\DeliverySlot::where('uuid', $slot)->firstOrFail();
            $this->authorize('update', $deliverySlot);

            $updatedSlot = $this->deliverySlotService->update($deliverySlot, $request->validated());

            return $this->successResponse(
                new \App\Http\Resources\DeliveryZone\DeliverySlotResource($updatedSlot->load(['deliveryZone'])),
                'Delivery slot updated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery slot not found');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $deliveryZone, string $slot): JsonResponse
    {
        try {
            $deliverySlot = \App\Models\Master\DeliverySlot::where('uuid', $slot)->firstOrFail();
            $this->authorize('delete', $deliverySlot);

            $this->deliverySlotService->delete($deliverySlot);

            return $this->successResponse(null, 'Delivery slot deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery slot not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $deliveryZone, string $uuid): JsonResponse
    {
        try {
            $slot = DeliverySlot::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $slot);

            $result = $this->deliverySlotService->restore($slot->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore delivery slot', 400);
            }

            return $this->successResponse(null, 'Delivery slot restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery slot not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $deliveryZone, string $uuid): JsonResponse
    {
        try {
            $slot = DeliverySlot::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('forceDelete', $slot);

            $this->deliverySlotService->forceDelete($slot);

            return $this->successResponse(null, 'Delivery slot permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Delivery slot not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getAvailableSlots(string $deliveryZone): JsonResponse
    {
        try {
            $zone = \App\Models\Master\DeliveryZone::where('uuid', $deliveryZone)->firstOrFail();
            $slots = $this->deliverySlotService->getAvailableSlots($zone->id);

            return $this->successResponse(
                \App\Http\Resources\DeliveryZone\DeliverySlotResource::collection($slots),
                'Available delivery slots retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
