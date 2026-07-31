<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierContactDTO;
use App\Models\SupplierContact;
use Illuminate\Support\Collection;

interface SupplierContactServiceInterface
{
    public function getBySupplier(int $supplierId): Collection;
    public function create(SupplierContactDTO $dto): SupplierContact;
    public function update(int $id, SupplierContactDTO $dto): ?SupplierContact;
    public function delete(int $id): bool;
}
