<?php

declare(strict_types=1);

namespace App\Repositories\Purchase;

use App\Models\PurchaseOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PurchaseOrderRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?PurchaseOrder;
    public function getByUuid(string $uuid): ?PurchaseOrder;
    public function create(array $data): PurchaseOrder;
    public function update(int $id, array $data): ?PurchaseOrder;
    public function delete(int $id): bool;
    public function generatePoNumber(): string;
    public function countByStatus(): array;
}
