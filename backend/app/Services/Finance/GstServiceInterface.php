<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\GstTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface GstServiceInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function addEntry(array $data): GstTransaction;
    public function getGstSummary(int $financialYearId, ?string $fromDate, ?string $toDate): array;
    public function getInputTax(): array;
    public function getOutputTax(): array;
}
