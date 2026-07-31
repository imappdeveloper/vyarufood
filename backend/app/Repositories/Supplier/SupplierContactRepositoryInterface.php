<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\SupplierContact;
use Illuminate\Support\Collection;

interface SupplierContactRepositoryInterface
{
    public function getBySupplier(int $supplierId): Collection;
    public function create(array $data): SupplierContact;
    public function update(int $id, array $data): ?SupplierContact;
    public function delete(int $id): bool;
}
