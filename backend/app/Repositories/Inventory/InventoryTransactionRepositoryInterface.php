<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InventoryTransactionRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?InventoryTransaction;
    public function getByUuid(string $uuid): ?InventoryTransaction;
    public function create(array $data): InventoryTransaction;
    public function getLedger(int $itemId, array $filters, int $perPage): LengthAwarePaginator;
    public function generateTransactionNumber(): string;
}
