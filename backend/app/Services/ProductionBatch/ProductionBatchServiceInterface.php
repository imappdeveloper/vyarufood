<?php

declare(strict_types=1);

namespace App\Services\ProductionBatch;

use App\DTOs\ProductionBatch\{ProductionBatchDTO, UpdateBatchItemDTO};
use App\Models\ProductionBatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductionBatchServiceInterface
{
    public function getPaginatedBatches(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getBatchById(int $id): ?ProductionBatch;
    public function getBatchByUuid(string $uuid): ?ProductionBatch;
    public function createBatch(ProductionBatchDTO $dto): ProductionBatch;
    public function updateBatch(int $id, ProductionBatchDTO $dto): ?ProductionBatch;
    public function deleteBatch(int $id): bool;
    public function restoreBatch(int $id): bool;
    public function forceDeleteBatch(int $id): bool;
    public function startProduction(int $id): ?ProductionBatch;
    public function pauseProduction(int $id): ?ProductionBatch;
    public function completeProduction(int $id): ?ProductionBatch;
    public function cancelProduction(int $id, ?string $reason = null): ?ProductionBatch;
    public function updateBatchItem(int $batchId, UpdateBatchItemDTO $dto): ?ProductionBatch;
    public function updateWastage(int $batchId, int $itemId, int $wastageQuantity, ?string $reason = null): ?ProductionBatch;
    public function packMeal(int $packingListId, int $packedBy): ?ProductionBatch;
    public function generateFromOrders(string $date, ?int $kitchenId = null): ProductionBatch;
    public function getStats(): array;
    public function getTodayProduction(?int $kitchenId = null): LengthAwarePaginator;
    public function getProductionSummary(string $date, ?int $kitchenId = null): array;
    public function getPackingList(int $batchId): \Illuminate\Database\Eloquent\Collection;
    public function getTimeline(int $batchId): array;
    public function bulkStart(array $batchIds): array;
    public function bulkComplete(array $batchIds): array;
}
