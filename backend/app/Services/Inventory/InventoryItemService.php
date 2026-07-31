<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\InventoryItemDTO;
use App\Models\InventoryItem;
use App\Repositories\Inventory\InventoryItemRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class InventoryItemService extends BaseService implements InventoryItemServiceInterface
{
    protected string $moduleName = 'inventory_item';

    public function __construct(
        private readonly InventoryItemRepositoryInterface $repo,
    ) {}

    public function getPaginatedItems(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getItemById(int $id): ?InventoryItem
    {
        return $this->repo->getById($id);
    }

    public function getItemByUuid(string $uuid): ?InventoryItem
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createItem(InventoryItemDTO $dto): InventoryItem
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = array_merge($dto->toArray(), [
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $item = $this->repo->create($data);

            CacheManager::flush('inventory');
            $this->logInfo('Inventory item created', ['item_id' => $item->id, 'code' => $item->item_code]);
            $this->logActivity('inventory_item_created', $item);

            return $item->fresh(['unit', 'category']);
        });
    }

    public function updateItem(int $id, InventoryItemDTO $dto): ?InventoryItem
    {
        return $this->transaction(function () use ($id, $dto) {
            $item = $this->repo->getById($id);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter($dto->toArray(), fn ($v) => $v !== null);
            $data['updated_by'] = $adminId;

            $this->repo->update($id, $data);

            CacheManager::flush('inventory');
            $this->logInfo('Inventory item updated', ['item_id' => $id]);
            $this->logActivity('inventory_item_updated', $item);

            return $this->repo->getById($id);
        });
    }

    public function deleteItem(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $item = $this->repo->getById($id);

            if (! $item) {
                throw new \RuntimeException('Inventory item not found.');
            }

            if ((float) $item->current_stock > 0) {
                throw new \RuntimeException('Cannot delete inventory item with existing stock.');
            }

            $item->delete();

            CacheManager::flush('inventory');
            $this->logInfo('Inventory item deleted', ['item_id' => $id]);
            $this->logActivity('inventory_item_deleted', $item);

            return true;
        });
    }

    public function getStats(): array
    {
        return $this->repo->countByStatus();
    }

    public function getDashboardStats(): array
    {
        $stats = $this->repo->countByStatus();
        $stats['total_stock_value'] = $this->repo->getTotalStockValue();
        $stats['items_below_reorder'] = $this->repo->getLowStockItems()->count();

        return $stats;
    }

    public function getLowStockItems(): Collection
    {
        return $this->repo->getLowStockItems();
    }

    public function getExpiringItems(int $days = 30): Collection
    {
        return $this->repo->getExpiringItems($days);
    }
}
