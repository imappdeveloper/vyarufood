<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\ExportRequestDTO;
use App\Jobs\Report\ExportReportJob;
use App\Models\Report\ReportExport;
use App\Repositories\Report\ReportExportRepositoryInterface;
use App\Repositories\Report\ReportRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ExportService extends BaseService implements ExportServiceInterface
{
    protected string $moduleName = 'ExportService';

    public function __construct(
        protected ReportRepositoryInterface $reportRepo,
        protected ReportExportRepositoryInterface $exportRepo,
    ) {}

    public function exportReport(ExportRequestDTO $dto): ReportExport
    {
        $export = $this->exportRepo->create([
            'report_name' => $dto->filename ?? "{$dto->reportType}_export_" . now()->format('Y_m_d_His'),
            'export_format' => $dto->format,
            'file_path' => null,
            'generated_by' => auth()->guard('admin')->id(),
            'generated_at' => now(),
        ]);

        $this->logInfo('Report export initiated', [
            'export_id' => $export->id,
            'report_type' => $dto->reportType,
            'format' => $dto->format,
        ]);

        ExportReportJob::dispatch($export->id, $dto->toArray());

        return $export;
    }

    public function getExportHistory(int $perPage = 15): LengthAwarePaginator
    {
        return $this->exportRepo->getPaginated([], $perPage);
    }
}
