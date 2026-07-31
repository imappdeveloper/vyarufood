<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\Models\Report\SavedReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SavedReportRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function findById(int $id): ?SavedReport;
    public function findByCode(string $code): ?SavedReport;
    public function create(array $data): SavedReport;
    public function update(SavedReport $report, array $data): SavedReport;
    public function delete(SavedReport $report): bool;
}
