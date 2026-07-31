<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\CustomerLedger;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerLedgerRepositoryInterface
{
    public function getPaginatedForCustomer(int $customerId, array $filters, int $perPage): LengthAwarePaginator;
    public function addEntry(array $data): CustomerLedger;
    public function getBalance(int $customerId): float;
}
