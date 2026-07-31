<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface InventoryItemRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?InventoryItem;
    public function getByUuid(string $uuid): ?InventoryItem;
    public function create(array $data): InventoryItem;
    public function update(int $id, array $data): ?InventoryItem;
    public function delete(int $id): bool;
    public function generateItemCode(): string;
    public function countByStatus(): array;
    public function getLowStockItems(): Collection;
    public function getExpiringItems(int $days = 30): Collection;
    public function getTotalStockValue(): float;
}
