<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\InventoryAdjustmentDTO;
use App\Models\InventoryAdjustment;
use App\Repositories\Inventory\InventoryAdjustmentRepositoryInterface;
use App\Repositories\Inventory\InventoryItemRepositoryInterface;
use App\Repositories\Inventory\InventoryTransactionRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InventoryAdjustmentService extends BaseService implements InventoryAdjustmentServiceInterface
{
    protected string $moduleName = 'inventory_adjustment';

    public function __construct(
        private readonly InventoryAdjustmentRepositoryInterface $repo,
        private readonly InventoryItemRepositoryInterface $itemRepo,
        private readonly InventoryTransactionRepositoryInterface $transactionRepo,
    ) {}

    public function getPaginatedAdjustments(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getAdjustmentById(int $id): ?InventoryAdjustment
    {
        return $this->repo->getById($id);
    }

    public function getAdjustmentByUuid(string $uuid): ?InventoryAdjustment
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createAdjustment(InventoryAdjustmentDTO $dto): InventoryAdjustment
    {
        return $this->transaction(function () use ($dto) {
            $item = $this->itemRepo->getById($dto->inventoryItemId);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $adjustmentNumber = $this->repo->generateAdjustmentNumber();

            $data = array_merge($dto->toArray(), [
                'adjustment_number' => $adjustmentNumber,
                'status' => 'pending',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $adjustment = $this->repo->create($data);

            CacheManager::flush('inventory');
            $this->logInfo('Adjustment created', [
                'adjustment_id' => $adjustment->id,
                'number' => $adjustmentNumber,
                'item_id' => $dto->inventoryItemId,
            ]);
            $this->logActivity('inventory_adjustment_created', $adjustment);

            return $adjustment->fresh(['inventoryItem', 'createdBy']);
        });
    }

    public function approveAdjustment(int $id): InventoryAdjustment
    {
        return $this->transaction(function () use ($id) {
            $adjustment = $this->repo->getById($id);

            if (! $adjustment) {
                throw new \RuntimeException('Inventory adjustment not found.');
            }

            if ($adjustment->status !== 'pending') {
                throw new \RuntimeException('Only pending adjustments can be approved.');
            }

            $item = $this->itemRepo->getById($adjustment->inventory_item_id);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $stockBefore = (float) $item->current_stock;
            $quantity = (float) $adjustment->adjustment_quantity;

            $stockAfter = match ($adjustment->adjustment_type) {
                'add' => $stockBefore + $quantity,
                'reduce' => $stockBefore - $quantity,
                default => $stockBefore,
            };

            if ($stockAfter < 0) {
                throw new \RuntimeException('Adjustment would result in negative stock.');
            }

            $this->repo->update($id, [
                'status' => 'approved',
                'approved_by' => $adminId,
                'approved_at' => now(),
                'updated_by' => $adminId,
            ]);

            $this->itemRepo->update($item->id, [
                'current_stock' => $stockAfter,
                'updated_by' => $adminId,
            ]);

            $transactionType = match ($adjustment->adjustment_type) {
                'add' => 'adjustment_add',
                'reduce' => 'adjustment_reduce',
                default => 'adjustment',
            };

            $this->transactionRepo->create([
                'inventory_item_id' => $item->id,
                'transaction_type' => $transactionType,
                'reference_type' => InventoryAdjustment::class,
                'reference_id' => $adjustment->id,
                'quantity' => $quantity,
                'unit_cost' => $item->cost_price,
                'total_cost' => $quantity * $item->cost_price,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'notes' => 'Adjustment approved: ' . $adjustment->reason,
                'created_by' => $adminId,
            ]);

            CacheManager::flush('inventory');
            $this->logInfo('Adjustment approved', [
                'adjustment_id' => $id,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
            ]);
            $this->logActivity('inventory_adjustment_approved', $adjustment);

            return $adjustment->fresh(['inventoryItem', 'approvedBy']);
        });
    }
}
