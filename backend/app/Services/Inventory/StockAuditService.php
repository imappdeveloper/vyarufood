<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\StockAuditDTO;
use App\Models\StockAudit;
use App\Repositories\Inventory\StockAuditRepositoryInterface;
use App\Repositories\Inventory\InventoryItemRepositoryInterface;
use App\Repositories\Inventory\InventoryTransactionRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StockAuditService extends BaseService implements StockAuditServiceInterface
{
    protected string $moduleName = 'stock_audit';

    public function __construct(
        private readonly StockAuditRepositoryInterface $repo,
        private readonly InventoryItemRepositoryInterface $itemRepo,
        private readonly InventoryTransactionRepositoryInterface $transactionRepo,
    ) {}

    public function getPaginatedAudits(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getAuditById(int $id): ?StockAudit
    {
        return $this->repo->getById($id);
    }

    public function getAuditByUuid(string $uuid): ?StockAudit
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createAudit(StockAuditDTO $dto): StockAudit
    {
        return $this->transaction(function () use ($dto) {
            $item = $this->itemRepo->getById($dto->inventoryItemId);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $auditNumber = $this->repo->generateAuditNumber();
            $systemQuantity = (float) $item->current_stock;

            $data = array_merge($dto->toArray(), [
                'audit_number' => $auditNumber,
                'system_quantity' => $systemQuantity,
                'difference_quantity' => $dto->physicalQuantity - $systemQuantity,
                'status' => 'pending',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $audit = $this->repo->create($data);

            CacheManager::flush('inventory');
            $this->logInfo('Stock audit created', [
                'audit_id' => $audit->id,
                'number' => $auditNumber,
                'item_id' => $dto->inventoryItemId,
                'system_qty' => $systemQuantity,
                'physical_qty' => $dto->physicalQuantity,
            ]);
            $this->logActivity('stock_audit_created', $audit);

            return $audit->fresh(['inventoryItem', 'createdBy']);
        });
    }

    public function approveAudit(int $id): StockAudit
    {
        return $this->transaction(function () use ($id) {
            $audit = $this->repo->getById($id);

            if (! $audit) {
                throw new \RuntimeException('Stock audit not found.');
            }

            if ($audit->status !== 'pending') {
                throw new \RuntimeException('Only pending audits can be approved.');
            }

            $item = $this->itemRepo->getById($audit->inventory_item_id);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $stockBefore = (float) $item->current_stock;
            $physicalQuantity = (float) $audit->physical_quantity;
            $difference = $physicalQuantity - $stockBefore;

            $this->repo->update($id, [
                'status' => 'approved',
                'approved_by' => $adminId,
                'approved_at' => now(),
                'updated_by' => $adminId,
            ]);

            $this->itemRepo->update($item->id, [
                'current_stock' => $physicalQuantity,
                'updated_by' => $adminId,
            ]);

            if ($difference != 0) {
                $transactionType = $difference > 0 ? 'adjustment_add' : 'adjustment_reduce';

                $this->transactionRepo->create([
                    'inventory_item_id' => $item->id,
                    'transaction_type' => $transactionType,
                    'reference_type' => StockAudit::class,
                    'reference_id' => $audit->id,
                    'quantity' => abs($difference),
                    'unit_cost' => $item->cost_price,
                    'total_cost' => abs($difference) * $item->cost_price,
                    'stock_before' => $stockBefore,
                    'stock_after' => $physicalQuantity,
                    'notes' => 'Stock audit adjustment from ' . $stockBefore . ' to ' . $physicalQuantity,
                    'created_by' => $adminId,
                ]);
            }

            CacheManager::flush('inventory');
            $this->logInfo('Stock audit approved', [
                'audit_id' => $id,
                'stock_before' => $stockBefore,
                'stock_after' => $physicalQuantity,
                'difference' => $difference,
            ]);
            $this->logActivity('stock_audit_approved', $audit);

            return $audit->fresh(['inventoryItem', 'approvedBy']);
        });
    }

    public function rejectAudit(int $id): StockAudit
    {
        return $this->transaction(function () use ($id) {
            $audit = $this->repo->getById($id);

            if (! $audit) {
                throw new \RuntimeException('Stock audit not found.');
            }

            if ($audit->status !== 'pending') {
                throw new \RuntimeException('Only pending audits can be rejected.');
            }

            $adminId = auth()->guard('admin')->id();

            $this->repo->update($id, [
                'status' => 'rejected',
                'approved_by' => $adminId,
                'approved_at' => now(),
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('inventory');
            $this->logInfo('Stock audit rejected', ['audit_id' => $id]);
            $this->logActivity('stock_audit_rejected', $audit);

            return $audit->fresh(['inventoryItem', 'approvedBy']);
        });
    }
}
