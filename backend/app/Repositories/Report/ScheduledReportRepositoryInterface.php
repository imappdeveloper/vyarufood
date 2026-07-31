<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\Models\Report\ScheduledReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ScheduledReportRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function findById(int $id): ?ScheduledReport;
    public function create(array $data): ScheduledReport;
    public function update(ScheduledReport $report, array $data): ScheduledReport;
    public function delete(ScheduledReport $report): bool;
    public function getDueReports(): Collection;
}
