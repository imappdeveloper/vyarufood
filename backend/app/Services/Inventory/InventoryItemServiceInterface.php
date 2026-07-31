<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\InventoryItemDTO;
use App\Models\InventoryItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface InventoryItemServiceInterface
{
    public function getPaginatedItems(array $filters, int $perPage): LengthAwarePaginator;
    public function getItemById(int $id): ?InventoryItem;
    public function getItemByUuid(string $uuid): ?InventoryItem;
    public function createItem(InventoryItemDTO $dto): InventoryItem;
    public function updateItem(int $id, InventoryItemDTO $dto): ?InventoryItem;
    public function deleteItem(int $id): bool;
    public function getStats(): array;
    public function getDashboardStats(): array;
    public function getLowStockItems(): Collection;
    public function getExpiringItems(int $days = 30): Collection;
}
