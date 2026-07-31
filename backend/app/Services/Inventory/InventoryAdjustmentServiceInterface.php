<?php

declare(strict_types=1);

namespace App\Services\Inventory;

use App\DTOs\Inventory\InventoryAdjustmentDTO;
use App\Models\InventoryAdjustment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InventoryAdjustmentServiceInterface
{
    public function getPaginatedAdjustments(array $filters, int $perPage): LengthAwarePaginator;
    public function getAdjustmentById(int $id): ?InventoryAdjustment;
    public function getAdjustmentByUuid(string $uuid): ?InventoryAdjustment;
    public function createAdjustment(InventoryAdjustmentDTO $dto): InventoryAdjustment;
    public function approveAdjustment(int $id): InventoryAdjustment;
}
