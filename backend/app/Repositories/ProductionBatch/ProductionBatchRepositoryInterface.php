<?php

declare(strict_types=1);

namespace App\Repositories\ProductionBatch;

use App\Models\ProductionBatch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductionBatchRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getById(int $id): ?ProductionBatch;
    public function getByUuid(string $uuid): ?ProductionBatch;
    public function create(array $data): ProductionBatch;
    public function update(int $id, array $data): ?ProductionBatch;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function forceDelete(int $id): bool;
    public function getStats(): array;
    public function getTodayProduction(int $kitchenId = null): Collection;
    public function generateBatchNumber(): string;
    public function getProductionSummary(string $date, ?int $kitchenId = null): array;
    public function getPackingList(int $batchId): Collection;
}
