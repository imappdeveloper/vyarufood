<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Inventory\StoreInventoryItemRequest;
use App\Http\Requests\Inventory\UpdateInventoryItemRequest;
use App\Http\Requests\Inventory\StoreInventoryBatchRequest;
use App\Http\Requests\Inventory\StoreInventoryAdjustmentRequest;
use App\Http\Requests\Inventory\StoreStockAuditRequest;
use App\Http\Requests\Inventory\ApproveStockAuditRequest;
use App\Http\Resources\Inventory\InventoryItemResource;
use App\Http\Resources\Inventory\InventoryBatchResource;
use App\Http\Resources\Inventory\InventoryTransactionResource;
use App\Http\Resources\Inventory\InventoryAdjustmentResource;
use App\Http\Resources\Inventory\StockAuditResource;
use App\Services\Inventory\InventoryItemServiceInterface;
use App\Services\Inventory\InventoryBatchServiceInterface;
use App\Services\Inventory\InventoryTransactionServiceInterface;
use App\Services\Inventory\InventoryAdjustmentServiceInterface;
use App\Services\Inventory\StockAuditServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends BaseController
{
    public function __construct(
        private readonly InventoryItemServiceInterface $itemService,
        private readonly InventoryBatchServiceInterface $batchService,
        private readonly InventoryTransactionServiceInterface $transactionService,
        private readonly InventoryAdjustmentServiceInterface $adjustmentService,
        private readonly StockAuditServiceInterface $auditService,
    ) {}

    // === INVENTORY ITEMS ===
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'category_name', 'low_stock']);
        $paginator = $this->itemService->getPaginatedItems($filters, $perPage);
        return $this->paginatedResponse(InventoryItemResource::collection($paginator), 'Inventory items retrieved successfully');
    }

    public function store(StoreInventoryItemRequest $request): JsonResponse
    {
        $dto = \App\DTOs\Inventory\InventoryItemDTO::fromArray($request->validated());
        $item = $this->itemService->createItem($dto);
        return $this->createdResponse(new InventoryItemResource($item), 'Inventory item created successfully');
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->itemService->getItemByUuid($uuid);
        if (!$item) return $this->notFoundResponse('Inventory item not found');
        $item->load(['unit', 'category', 'batches', 'createdBy', 'updatedBy']);
        return $this->successResponse(new InventoryItemResource($item), 'Inventory item retrieved successfully');
    }

    public function update(UpdateInventoryItemRequest $request, string $uuid): JsonResponse
    {
        $item = $this->itemService->getItemByUuid($uuid);
        if (!$item) return $this->notFoundResponse('Inventory item not found');
        $dto = \App\DTOs\Inventory\InventoryItemDTO::fromArray($request->validated());
        $item = $this->itemService->updateItem($item->id, $dto);
        return $this->successResponse(new InventoryItemResource($item), 'Inventory item updated successfully');
    }

    public function destroy(string $uuid): JsonResponse
    {
        $item = $this->itemService->getItemByUuid($uuid);
        if (!$item) return $this->notFoundResponse('Inventory item not found');
        $this->itemService->deleteItem($item->id);
        return $this->noContentResponse('Inventory item deleted successfully');
    }

    // === STATS ===
    public function stats(): JsonResponse
    {
        return $this->successResponse($this->itemService->getStats(), 'Inventory statistics retrieved successfully');
    }

    public function dashboardStats(): JsonResponse
    {
        return $this->successResponse($this->itemService->getDashboardStats(), 'Inventory dashboard stats retrieved successfully');
    }

    public function lowStock(): JsonResponse
    {
        $items = $this->itemService->getLowStockItems();
        return $this->successResponse(InventoryItemResource::collection($items), 'Low stock items retrieved successfully');
    }

    public function expiring(Request $request): JsonResponse
    {
        $days = (int) $request->input('days', 30);
        $items = $this->itemService->getExpiringItems($days);
        return $this->successResponse(InventoryBatchResource::collection($items), 'Expiring items retrieved successfully');
    }

    // === BATCHES ===
    public function batches(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'inventory_item_id', 'expiring']);
        $paginator = $this->batchService->getPaginatedBatches($filters, $perPage);
        return $this->paginatedResponse(InventoryBatchResource::collection($paginator), 'Batches retrieved successfully');
    }

    public function storeBatch(StoreInventoryBatchRequest $request): JsonResponse
    {
        $dto = \App\DTOs\Inventory\InventoryBatchDTO::fromArray($request->validated());
        $batch = $this->batchService->createBatch($dto);
        return $this->createdResponse(new InventoryBatchResource($batch), 'Batch created successfully');
    }

    public function showBatch(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);
        if (!$batch) return $this->notFoundResponse('Batch not found');
        $batch->load(['inventoryItem', 'supplier']);
        return $this->successResponse(new InventoryBatchResource($batch), 'Batch retrieved successfully');
    }

    public function destroyBatch(string $uuid): JsonResponse
    {
        $batch = $this->batchService->getBatchByUuid($uuid);
        if (!$batch) return $this->notFoundResponse('Batch not found');
        $this->batchService->deleteBatch($batch->id);
        return $this->noContentResponse('Batch deleted successfully');
    }

    // === TRANSACTIONS ===
    public function transactions(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'transaction_type', 'inventory_item_id']);
        $paginator = $this->transactionService->getPaginatedTransactions($filters, $perPage);
        return $this->paginatedResponse(InventoryTransactionResource::collection($paginator), 'Transactions retrieved successfully');
    }

    public function ledger(Request $request): JsonResponse
    {
        $request->validate(['inventory_item_id' => 'required|exists:inventory_items,id']);
        $perPage = (int) $request->input('per_page', 50);
        $filters = $request->only(['transaction_type', 'date_from', 'date_to']);
        $paginator = $this->transactionService->getLedger((int) $request->input('inventory_item_id'), $filters, $perPage);
        return $this->paginatedResponse(InventoryTransactionResource::collection($paginator), 'Stock ledger retrieved successfully');
    }

    // === ADJUSTMENTS ===
    public function adjustments(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'adjustment_type', 'inventory_item_id']);
        $paginator = $this->adjustmentService->getPaginatedAdjustments($filters, $perPage);
        return $this->paginatedResponse(InventoryAdjustmentResource::collection($paginator), 'Adjustments retrieved successfully');
    }

    public function storeAdjustment(StoreInventoryAdjustmentRequest $request): JsonResponse
    {
        $dto = \App\DTOs\Inventory\InventoryAdjustmentDTO::fromArray($request->validated());
        $adjustment = $this->adjustmentService->createAdjustment($dto);
        return $this->createdResponse(new InventoryAdjustmentResource($adjustment), 'Adjustment created successfully');
    }

    public function approveAdjustment(string $uuid): JsonResponse
    {
        $adjustment = $this->adjustmentService->getAdjustmentByUuid($uuid);
        if (!$adjustment) return $this->notFoundResponse('Adjustment not found');
        $adjustment = $this->adjustmentService->approveAdjustment($adjustment->id, auth()->guard('admin')->id());
        return $this->successResponse(new InventoryAdjustmentResource($adjustment), 'Adjustment approved successfully');
    }

    // === AUDITS ===
    public function audits(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'inventory_item_id']);
        $paginator = $this->auditService->getPaginatedAudits($filters, $perPage);
        return $this->paginatedResponse(StockAuditResource::collection($paginator), 'Audits retrieved successfully');
    }

    public function storeAudit(StoreStockAuditRequest $request): JsonResponse
    {
        $dto = \App\DTOs\Inventory\StockAuditDTO::fromArray($request->validated());
        $audit = $this->auditService->createAudit($dto);
        return $this->createdResponse(new StockAuditResource($audit), 'Audit created successfully');
    }

    public function approveAudit(string $uuid, ApproveStockAuditRequest $request): JsonResponse
    {
        $audit = $this->auditService->getAuditByUuid($uuid);
        if (!$audit) return $this->notFoundResponse('Audit not found');
        $audit = $this->auditService->approveAudit($audit->id, auth()->guard('admin')->id());
        return $this->successResponse(new StockAuditResource($audit), 'Audit approved successfully');
    }

    public function rejectAudit(string $uuid): JsonResponse
    {
        $audit = $this->auditService->getAuditByUuid($uuid);
        if (!$audit) return $this->notFoundResponse('Audit not found');
        $audit = $this->auditService->rejectAudit($audit->id, auth()->guard('admin')->id());
        return $this->successResponse(new StockAuditResource($audit), 'Audit rejected successfully');
    }
}
