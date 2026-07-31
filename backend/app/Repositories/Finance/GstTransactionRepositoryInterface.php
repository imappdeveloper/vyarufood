<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\GstTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GstTransactionRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function addEntry(array $data): GstTransaction;
    public function getGstSummary(int $financialYearId, string $type): array;
}
