<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\Report\ScheduledReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ScheduleServiceInterface
{
    public function getScheduledReports(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function createScheduledReport(array $data): ScheduledReport;
    public function updateScheduledReport(int $id, array $data): ScheduledReport;
    public function deleteScheduledReport(int $id): bool;
    public function processDueReports(): int;
}
