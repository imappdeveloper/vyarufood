<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierDocumentDTO;
use App\Models\SupplierDocument;
use Illuminate\Support\Collection;

interface SupplierDocumentServiceInterface
{
    public function getBySupplier(int $supplierId): Collection;
    public function create(SupplierDocumentDTO $dto): SupplierDocument;
    public function delete(int $id): bool;
    public function getExpiringSoon(int $days): Collection;
}
