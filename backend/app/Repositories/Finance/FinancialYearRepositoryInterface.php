<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\FinancialYear;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface FinancialYearRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?FinancialYear;
    public function getByUuid(string $uuid): ?FinancialYear;
    public function create(array $data): FinancialYear;
    public function update(int $id, array $data): FinancialYear;
    public function delete(int $id): bool;
    public function getCurrent(): ?FinancialYear;
    public function closeYear(int $id, int $closedBy, ?string $remarks): FinancialYear;
}
