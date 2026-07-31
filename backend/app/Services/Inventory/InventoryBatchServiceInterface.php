<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\InventoryBatchDTO;
use App\Models\InventoryBatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface InventoryBatchServiceInterface
{
    public function getPaginatedBatches(array $filters, int $perPage): LengthAwarePaginator;
    public function getBatchById(int $id): ?InventoryBatch;
    public function getBatchByUuid(string $uuid): ?InventoryBatch;
    public function createBatch(InventoryBatchDTO $dto): InventoryBatch;
    public function updateBatch(int $id, InventoryBatchDTO $dto): ?InventoryBatch;
    public function deleteBatch(int $id): bool;
    public function getActiveBatches(): Collection;
    public function getExpiredBatches(): Collection;
}
