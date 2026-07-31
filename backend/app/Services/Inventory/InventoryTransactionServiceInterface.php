<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\Models\InventoryTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InventoryTransactionServiceInterface
{
    public function getPaginatedTransactions(array $filters, int $perPage): LengthAwarePaginator;
    public function getTransactionById(int $id): ?InventoryTransaction;
    public function getLedger(int $inventoryItemId, int $perPage = 50): LengthAwarePaginator;
    public function createTransaction(array $data): InventoryTransaction;
    public function getTransactionStats(): array;
}
