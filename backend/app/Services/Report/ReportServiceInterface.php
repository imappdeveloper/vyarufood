<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\ReportFilterDTO;

interface ReportServiceInterface
{
    public function generateReport(string $reportType, ReportFilterDTO $filters): array;
}
