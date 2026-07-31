<?php

declare(strict_types=1);

namespace App\Repositories\Inventory;

use App\Models\InventoryAdjustment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InventoryAdjustmentRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?InventoryAdjustment;
    public function getByUuid(string $uuid): ?InventoryAdjustment;
    public function create(array $data): InventoryAdjustment;
    public function approve(int $id, int $adminId): ?InventoryAdjustment;
    public function generateAdjustmentNumber(): string;
}
