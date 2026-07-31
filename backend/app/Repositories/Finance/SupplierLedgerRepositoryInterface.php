<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\SupplierLedger;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SupplierLedgerRepositoryInterface
{
    public function getPaginatedForSupplier(int $supplierId, array $filters, int $perPage): LengthAwarePaginator;
    public function addEntry(array $data): SupplierLedger;
    public function getBalance(int $supplierId): float;
}
