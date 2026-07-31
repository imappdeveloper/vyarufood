<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\ExportRequestDTO;
use App\Models\Report\ReportExport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ExportServiceInterface
{
    public function exportReport(ExportRequestDTO $dto): ReportExport;
    public function getExportHistory(int $perPage = 15): LengthAwarePaginator;
}
