<?php

declare(strict_types=1);

namespace App\Services\Purchase;

use App\DTOs\Purchase\PurchaseRequestDTO;
use App\Models\{PurchaseRequest, PurchaseRequestItem, InventoryItem};
use App\Repositories\Purchase\PurchaseRequestRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PurchaseRequestService extends BaseService implements PurchaseRequestServiceInterface
{
    protected string $moduleName = 'purchase_request';

    public function __construct(
        protected PurchaseRequestRepositoryInterface $prRepo,
    ) {}

    public function getPaginatedRequests(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->prRepo->getPaginated($filters, $perPage);
    }

    public function getRequestById(int $id): ?PurchaseRequest
    {
        return $this->prRepo->getById($id);
    }

    public function getRequestByUuid(string $uuid): ?PurchaseRequest
    {
        return $this->prRepo->getByUuid($uuid);
    }

    public function createRequest(PurchaseRequestDTO $dto): PurchaseRequest
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = [
                'request_number' => $this->prRepo->generateRequestNumber(),
                'request_date' => $dto->requestDate ?? now()->toDateString(),
                'request_type' => $dto->requestType,
                'requested_by' => $dto->requestedBy,
                'department' => $dto->department,
                'priority' => $dto->priority,
                'status' => 'draft',
                'expected_date' => $dto->expectedDate,
                'remarks' => $dto->remarks,
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ];

            $purchaseRequest = $this->prRepo->create($data);

            foreach ($dto->items as $itemDto) {
                PurchaseRequestItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'purchase_request_id' => $purchaseRequest->id,
                    'inventory_item_id' => $itemDto->inventoryItemId,
                    'requested_quantity' => $itemDto->requestedQuantity,
                    'unit_id' => $itemDto->unitId,
                    'remarks' => $itemDto->remarks,
                ]);
            }

            CacheManager::flush('purchase');
            $this->logInfo('Purchase request created', ['pr_id' => $purchaseRequest->id]);
            $this->logActivity('purchase_request_created', $purchaseRequest);

            return $purchaseRequest->fresh(['items.inventoryItem', 'items.unit']);
        });
    }

    public function updateRequest(int $id, PurchaseRequestDTO $dto): ?PurchaseRequest
    {
        return $this->transaction(function () use ($id, $dto) {
            $purchaseRequest = $this->prRepo->getById($id);

            if (! $purchaseRequest) {
                throw new \RuntimeException('Purchase request not found.');
            }

            if ($purchaseRequest->status !== 'draft') {
                throw new \RuntimeException('Cannot edit a purchase request that is not in draft status.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter([
                'request_date' => $dto->requestDate,
                'request_type' => $dto->requestType,
                'requested_by' => $dto->requestedBy,
                'department' => $dto->department,
                'priority' => $dto->priority,
                'expected_date' => $dto->expectedDate,
                'remarks' => $dto->remarks,
                'updated_by' => $adminId,
            ], fn ($v) => $v !== null);

            $this->prRepo->update($id, $data);

            if (! empty($dto->items)) {
                PurchaseRequestItem::where('purchase_request_id', $id)->delete();

                foreach ($dto->items as $itemDto) {
                    PurchaseRequestItem::create([
                        'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                        'purchase_request_id' => $id,
                        'inventory_item_id' => $itemDto->inventoryItemId,
                        'requested_quantity' => $itemDto->requestedQuantity,
                        'unit_id' => $itemDto->unitId,
                        'remarks' => $itemDto->remarks,
                    ]);
                }
            }

            CacheManager::flush('purchase');
            $this->logInfo('Purchase request updated', ['pr_id' => $id]);
            $this->logActivity('purchase_request_updated', $purchaseRequest);

            return $this->prRepo->getById($id);
        });
    }

    public function deleteRequest(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $purchaseRequest = $this->prRepo->getById($id);

            if (! $purchaseRequest) {
                throw new \RuntimeException('Purchase request not found.');
            }

            if ($purchaseRequest->status !== 'draft') {
                throw new \RuntimeException('Cannot delete a purchase request that is not in draft status.');
            }

            $result = $this->prRepo->delete($id);
            CacheManager::flush('purchase');
            $this->logActivity('purchase_request_deleted', null, ['pr_id' => $id]);

            return $result;
        });
    }

    public function approveRequest(int $id, int $adminId): ?PurchaseRequest
    {
        return $this->transaction(function () use ($id, $adminId) {
            $purchaseRequest = $this->prRepo->getById($id);

            if (! $purchaseRequest) {
                throw new \RuntimeException('Purchase request not found.');
            }

            if ($purchaseRequest->status !== 'pending_approval') {
                throw new \RuntimeException('Only pending requests can be approved.');
            }

            $this->prRepo->update($id, [
                'status' => 'approved',
                'approved_by' => $adminId,
                'approved_at' => now(),
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase request approved', ['pr_id' => $id]);
            $this->logActivity('purchase_request_approved', $purchaseRequest);

            return $this->prRepo->getById($id);
        });
    }

    public function rejectRequest(int $id, int $adminId, ?string $reason = null): ?PurchaseRequest
    {
        return $this->transaction(function () use ($id, $adminId, $reason) {
            $purchaseRequest = $this->prRepo->getById($id);

            if (! $purchaseRequest) {
                throw new \RuntimeException('Purchase request not found.');
            }

            if ($purchaseRequest->status !== 'pending_approval') {
                throw new \RuntimeException('Only pending requests can be rejected.');
            }

            $this->prRepo->update($id, [
                'status' => 'rejected',
                'approved_by' => $adminId,
                'approved_at' => now(),
                'remarks' => $reason ?? $purchaseRequest->remarks,
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase request rejected', ['pr_id' => $id]);
            $this->logActivity('purchase_request_rejected', $purchaseRequest);

            return $this->prRepo->getById($id);
        });
    }

    public function cancelRequest(int $id): ?PurchaseRequest
    {
        return $this->transaction(function () use ($id) {
            $purchaseRequest = $this->prRepo->getById($id);

            if (! $purchaseRequest) {
                throw new \RuntimeException('Purchase request not found.');
            }

            if (in_array($purchaseRequest->status, ['cancelled', 'converted_to_po'])) {
                throw new \RuntimeException('Cannot cancel a request that is already cancelled or converted.');
            }

            $adminId = auth()->guard('admin')->id();
            $this->prRepo->update($id, [
                'status' => 'cancelled',
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('purchase');
            $this->logInfo('Purchase request cancelled', ['pr_id' => $id]);
            $this->logActivity('purchase_request_cancelled', $purchaseRequest);

            return $this->prRepo->getById($id);
        });
    }

    public function getStats(): array
    {
        return $this->prRepo->countByStatus();
    }

    public function createAutoReorderRequests(): array
    {
        return $this->transaction(function () {
            $lowStockItems = InventoryItem::where('status', 'active')
                ->whereColumn('current_stock', '<=', 'minimum_stock')
                ->get();

            if ($lowStockItems->isEmpty()) {
                return [];
            }

            $adminId = auth()->guard('admin')->id();
            $createdRequests = [];

            $request = $this->prRepo->create([
                'request_number' => $this->prRepo->generateRequestNumber(),
                'request_date' => now()->toDateString(),
                'request_type' => 'auto_reorder',
                'requested_by' => 'System Auto-Reorder',
                'department' => 'Inventory',
                'priority' => 'high',
                'status' => 'pending_approval',
                'expected_date' => now()->addDays(7)->toDateString(),
                'remarks' => 'Auto-generated reorder request for low stock items',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            foreach ($lowStockItems as $item) {
                $reorderQty = $item->maximum_stock - $item->current_stock;
                PurchaseRequestItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'purchase_request_id' => $request->id,
                    'inventory_item_id' => $item->id,
                    'requested_quantity' => $reorderQty,
                    'unit_id' => $item->unit_id,
                    'remarks' => "Current stock: {$item->current_stock}, Minimum: {$item->minimum_stock}",
                ]);
            }

            $createdRequests[] = $request;
            CacheManager::flush('purchase');
            $this->logInfo('Auto-reorder requests created', ['count' => 1, 'items_count' => $lowStockItems->count()]);

            return $createdRequests;
        });
    }
}
