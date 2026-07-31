<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierProductDTO;
use App\Models\SupplierProduct;
use Illuminate\Support\Collection;

interface SupplierProductServiceInterface
{
    public function getBySupplier(int $supplierId): Collection;
    public function create(SupplierProductDTO $dto): SupplierProduct;
    public function update(int $id, SupplierProductDTO $dto): ?SupplierProduct;
    public function delete(int $id): bool;
    public function updatePrice(int $id, float $newPrice, ?string $remarks = null): SupplierProduct;
}
