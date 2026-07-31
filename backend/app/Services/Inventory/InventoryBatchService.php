<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\InventoryBatchDTO;
use App\Models\InventoryBatch;
use App\Repositories\Inventory\InventoryBatchRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class InventoryBatchService extends BaseService implements InventoryBatchServiceInterface
{
    protected string $moduleName = 'inventory_batch';

    public function __construct(
        private readonly InventoryBatchRepositoryInterface $repo,
    ) {}

    public function getPaginatedBatches(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getBatchById(int $id): ?InventoryBatch
    {
        return $this->repo->getById($id);
    }

    public function getBatchByUuid(string $uuid): ?InventoryBatch
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createBatch(InventoryBatchDTO $dto): InventoryBatch
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = array_merge($dto->toArray(), [
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $batch = $this->repo->create($data);

            CacheManager::flush('inventory');
            $this->logInfo('Inventory batch created', ['batch_id' => $batch->id, 'number' => $batch->batch_number]);
            $this->logActivity('inventory_batch_created', $batch);

            return $batch->fresh(['inventoryItem', 'supplier']);
        });
    }

    public function updateBatch(int $id, InventoryBatchDTO $dto): ?InventoryBatch
    {
        return $this->transaction(function () use ($id, $dto) {
            $batch = $this->repo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Inventory batch not found.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter($dto->toArray(), fn ($v) => $v !== null);
            $data['updated_by'] = $adminId;

            $this->repo->update($id, $data);

            CacheManager::flush('inventory');
            $this->logInfo('Inventory batch updated', ['batch_id' => $id]);
            $this->logActivity('inventory_batch_updated', $batch);

            return $this->repo->getById($id);
        });
    }

    public function deleteBatch(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $batch = $this->repo->getById($id);

            if (! $batch) {
                throw new \RuntimeException('Inventory batch not found.');
            }

            if ((float) $batch->available_quantity > 0) {
                throw new \RuntimeException('Cannot delete batch with available stock.');
            }

            $batch->delete();

            CacheManager::flush('inventory');
            $this->logInfo('Inventory batch deleted', ['batch_id' => $id]);
            $this->logActivity('inventory_batch_deleted', $batch);

            return true;
        });
    }

    public function getActiveBatches(): Collection
    {
        return $this->repo->getActiveBatches();
    }

    public function getExpiredBatches(): Collection
    {
        return $this->repo->getExpiredBatches();
    }
}
