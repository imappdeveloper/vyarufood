<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\Models\InventoryTransaction;
use App\Repositories\Inventory\InventoryTransactionRepositoryInterface;
use App\Repositories\Inventory\InventoryItemRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InventoryTransactionService extends BaseService implements InventoryTransactionServiceInterface
{
    protected string $moduleName = 'inventory_transaction';

    public function __construct(
        private readonly InventoryTransactionRepositoryInterface $repo,
        private readonly InventoryItemRepositoryInterface $itemRepo,
    ) {}

    public function getPaginatedTransactions(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getTransactionById(int $id): ?InventoryTransaction
    {
        return $this->repo->getById($id);
    }

    public function getLedger(int $inventoryItemId, int $perPage = 50): LengthAwarePaginator
    {
        return $this->repo->getLedger($inventoryItemId, $perPage);
    }

    public function createTransaction(array $data): InventoryTransaction
    {
        return $this->transaction(function () use ($data) {
            $item = $this->itemRepo->getById($data['inventory_item_id']);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            $stockBefore = (float) $item->current_stock;
            $quantity = (float) ($data['quantity'] ?? 0);
            $transactionType = $data['transaction_type'] ?? '';

            $stockAfter = match ($transactionType) {
                'inward', 'purchase', 'return', 'adjustment_add' => $stockBefore + $quantity,
                'outward', 'consumption', 'sale', 'adjustment_reduce', 'wastage' => $stockBefore - $quantity,
                default => $stockBefore,
            };

            if ($stockAfter < 0) {
                throw new \RuntimeException('Insufficient stock. Available: ' . $stockBefore . ', Requested: ' . $quantity);
            }

            $adminId = auth()->guard('admin')->id();

            $transactionData = array_merge($data, [
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'created_by' => $adminId,
            ]);

            $transaction = $this->repo->create($transactionData);

            $this->itemRepo->update($item->id, [
                'current_stock' => $stockAfter,
                'updated_by' => $adminId,
            ]);

            CacheManager::flush('inventory');
            $this->logInfo('Transaction created', [
                'transaction_id' => $transaction->id,
                'item_id' => $item->id,
                'type' => $transactionType,
                'quantity' => $quantity,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
            ]);
            $this->logActivity('inventory_transaction_created', $transaction);

            return $transaction->fresh(['inventoryItem', 'batch']);
        });
    }

    public function getTransactionStats(): array
    {
        return $this->repo->getTransactionStats();
    }
}
