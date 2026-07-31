<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryBatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface InventoryBatchRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?InventoryBatch;
    public function getByUuid(string $uuid): ?InventoryBatch;
    public function create(array $data): InventoryBatch;
    public function update(int $id, array $data): ?InventoryBatch;
    public function delete(int $id): bool;
    public function getActiveBatches(int $itemId): Collection;
    public function getExpiredBatches(): Collection;
    public function generateBatchNumber(): string;
}
