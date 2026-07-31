<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\SupplierDocument;
use Illuminate\Support\Collection;

interface SupplierDocumentRepositoryInterface
{
    public function getBySupplier(int $supplierId): Collection;
    public function create(array $data): SupplierDocument;
    public function delete(int $id): bool;
    public function getExpiringSoon(int $days): Collection;
}
