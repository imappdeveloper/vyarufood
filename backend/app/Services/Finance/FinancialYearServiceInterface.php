<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\FinancialYear;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface FinancialYearServiceInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?FinancialYear;
    public function getByUuid(string $uuid): ?FinancialYear;
    public function create(array $data): FinancialYear;
    public function update(int $id, array $data): FinancialYear;
    public function getCurrent(): ?FinancialYear;
    public function closeYear(string $uuid, int $closedBy, ?string $remarks): FinancialYear;
}
