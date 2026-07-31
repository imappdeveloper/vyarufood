<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\ProductionBatch\{StoreProductionBatchRequest, UpdateProductionBatchRequest, UpdateBatchItemRequest, UpdateWastageRequest, PackMealRequest};
use App\Http\Resources\ProductionBatch\{ProductionBatchResource, MealPackingListResource};
use App\Services\ProductionBatch\ProductionBatchServiceInterface;
use App\DTOs\ProductionBatch\{ProductionBatchDTO, UpdateBatchItemDTO};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionBatchController extends BaseController
{
    public function __construct(
        protected ProductionBatchServiceInterface $batchService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['search', 'production_status', 'kitchen_id', 'batch_type', 'date_from', 'date_to', 'production_date']);

        $batches = $this->batchService->getPaginatedBatches($filters, $perPage);

        return $this->paginatedResponse(
            ProductionBatchResource::collection($batches),
            'Production batches retrieved successfully'
        );
    }

    public function store(StoreProductionBatchRequest $request): JsonResponse
    {
        $dto = ProductionBatchDTO::fromArray($request->validated() + [
            'created_by' => auth()->guard('admin')->id(),
            'updated_by' => auth()->guard('admin')->id(),
        ]);

        $batch = $this->batchService->createBatch($dto);

        return $this->createdResponse(
            new ProductionBatchResource($batch->fresh(['kitchen'])),
            'Production batch created successfully.',
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        return $this->successResponse(
            new ProductionBatchResource($batch),
        );
    }

    public function update(UpdateProductionBatchRequest $request, string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $dto = ProductionBatchDTO::fromArray($request->validated() + [
            'id' => $batch->id,
            'updated_by' => auth()->guard('admin')->id(),
        ]);

        $updated = $this->batchService->updateBatch($batch->id, $dto);

        return $this->successResponse(
            new ProductionBatchResource($updated->fresh(['kitchen'])),
            'Production batch updated successfully.',
        );
    }

    public function destroy(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $this->batchService->deleteBatch($batch->id);

        return $this->successResponse(null, 'Production batch deleted successfully.');
    }

    public function restore(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $this->batchService->restoreBatch($batch->id);

        return $this->successResponse(null, 'Production batch restored successfully.');
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $this->batchService->forceDeleteBatch($batch->id);

        return $this->successResponse(null, 'Production batch permanently deleted.');
    }

    public function start(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $batch = $this->batchService->startProduction($batch->id);

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Production started successfully.',
        );
    }

    public function pause(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $batch = $this->batchService->pauseProduction($batch->id);

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Production paused successfully.',
        );
    }

    public function complete(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $batch = $this->batchService->completeProduction($batch->id);

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Production completed successfully.',
        );
    }

    public function cancel(Request $request, string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $batch = $this->batchService->cancelProduction($batch->id, $request->input('reason'));

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Production cancelled successfully.',
        );
    }

    public function updateItems(UpdateBatchItemRequest $request, string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $results = [];
        foreach ($request->validated('items') as $itemData) {
            $dto = UpdateBatchItemDTO::fromArray($itemData);
            $this->batchService->updateBatchItem($batch->id, $dto);
            $results[] = $itemData;
        }

        $batch = $this->batchService->getBatchByUuid($uuid);

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Batch items updated successfully.',
        );
    }

    public function updateWastage(UpdateWastageRequest $request, string $uuid, int $itemId): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $batch = $this->batchService->updateWastage(
            $batch->id,
            $itemId,
            $request->validated('wastage_quantity'),
            $request->validated('reason'),
        );

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Wastage recorded successfully.',
        );
    }

    public function generateFromOrders(Request $request): JsonResponse
    {
        $request->validate([
            'production_date' => 'required|date',
            'kitchen_id' => 'nullable|exists:kitchens,id',
        ]);

        $batch = $this->batchService->generateFromOrders(
            $request->validated('production_date'),
            $request->validated('kitchen_id'),
        );

        return $this->createdResponse(
            new ProductionBatchResource($batch),
            'Production batch generated from orders.',
        );
    }

    public function getStats(): JsonResponse
    {
        $stats = $this->batchService->getStats();

        return $this->successResponse($stats);
    }

    public function getProductionSummary(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
            'kitchen_id' => 'nullable|exists:kitchens,id',
        ]);

        $summary = $this->batchService->getProductionSummary(
            $request->validated('date'),
            $request->validated('kitchen_id'),
        );

        return $this->successResponse($summary);
    }

    public function getPackingList(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $packingList = $this->batchService->getPackingList($batch->id);

        return $this->successResponse(
            MealPackingListResource::collection($packingList),
        );
    }

    public function packMeal(PackMealRequest $request, string $uuid, int $packingId): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $adminId = auth()->guard('admin')->id();
        $batch = $this->batchService->packMeal($packingId, $adminId);

        return $this->successResponse(
            new ProductionBatchResource($batch),
            'Meal packed successfully.',
        );
    }

    public function getTimeline(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);

        if (! $batch) {
            return $this->notFoundResponse('Production batch not found.');
        }

        $timeline = $this->batchService->getTimeline($batch->id);

        return $this->successResponse($timeline);
    }

    public function bulkStart(Request $request): JsonResponse
    {
        $request->validate([
            'batch_ids' => 'required|array|min:1',
            'batch_ids.*' => 'required|integer|exists:production_batches,id',
        ]);

        $results = $this->batchService->bulkStart($request->validated('batch_ids'));

        return $this->successResponse($results, 'Bulk start completed.');
    }

    public function bulkComplete(Request $request): JsonResponse
    {
        $request->validate([
            'batch_ids' => 'required|array|min:1',
            'batch_ids.*' => 'required|integer|exists:production_batches,id',
        ]);

        $results = $this->batchService->bulkComplete($request->validated('batch_ids'));

        return $this->successResponse($results, 'Bulk complete completed.');
    }
}
