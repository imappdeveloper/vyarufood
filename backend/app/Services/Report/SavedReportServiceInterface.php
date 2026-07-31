<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\Report\SavedReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SavedReportServiceInterface
{
    public function getSavedReports(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function getSavedReport(int $id): ?SavedReport;
    public function createSavedReport(array $data): SavedReport;
    public function updateSavedReport(int $id, array $data): SavedReport;
    public function deleteSavedReport(int $id): bool;
}
