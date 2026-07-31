<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\SupplierProduct;
use Illuminate\Support\Collection;

interface SupplierProductRepositoryInterface
{
    public function getBySupplier(int $supplierId): Collection;
    public function create(array $data): SupplierProduct;
    public function update(int $id, array $data): ?SupplierProduct;
    public function delete(int $id): bool;
    public function updatePrice(int $id, float $newPrice, ?string $remarks = null): SupplierProduct;
}
