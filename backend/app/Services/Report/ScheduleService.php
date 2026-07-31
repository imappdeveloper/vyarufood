<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\DTOs\Report\ExportRequestDTO;
use App\Jobs\Report\ExportReportJob;
use App\Models\Report\ScheduledReport;
use App\Repositories\Report\ScheduledReportRepositoryInterface;
use App\Support\BaseService;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ScheduleService extends BaseService implements ScheduleServiceInterface
{
    protected string $moduleName = 'ScheduleService';

    public function __construct(
        protected ScheduledReportRepositoryInterface $repo,
    ) {}

    public function getScheduledReports(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function createScheduledReport(array $data): ScheduledReport
    {
        return $this->transaction(function () use ($data) {
            $data['created_by'] = auth()->guard('admin')->id();

            if (! isset($data['next_run']) || empty($data['next_run'])) {
                $data['next_run'] = $this->calculateNextRun($data['frequency']);
            }

            $report = $this->repo->create($data);

            $this->logInfo('Scheduled report created', ['id' => $report->id, 'name' => $report->report_name]);

            return $report;
        });
    }

    public function updateScheduledReport(int $id, array $data): ScheduledReport
    {
        return $this->transaction(function () use ($id, $data) {
            $report = $this->repo->findById($id);

            if (! $report) {
                throw new \App\Exceptions\ModelNotFoundException("Scheduled report not found");
            }

            if (isset($data['frequency']) && ! isset($data['next_run'])) {
                $data['next_run'] = $this->calculateNextRun($data['frequency']);
            }

            $report = $this->repo->update($report, $data);

            $this->logInfo('Scheduled report updated', ['id' => $report->id]);

            return $report;
        });
    }

    public function deleteScheduledReport(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $report = $this->repo->findById($id);

            if (! $report) {
                throw new \App\Exceptions\ModelNotFoundException("Scheduled report not found");
            }

            $result = $this->repo->delete($report);

            $this->logInfo('Scheduled report deleted', ['id' => $id]);

            return $result;
        });
    }

    public function processDueReports(): int
    {
        $dueReports = $this->repo->getDueReports();
        $processedCount = 0;

        foreach ($dueReports as $report) {
            try {
                $dto = new ExportRequestDTO(
                    reportType: $report->report_type,
                    format: $report->export_format,
                    filters: [],
                    filename: "{$report->report_name}_" . now()->format('Y_m_d_His'),
                );

                $this->repo->update($report, [
                    'next_run' => $this->calculateNextRun($report->frequency),
                ]);

                $processedCount++;
            } catch (\Exception $e) {
                $this->logError('Failed to process scheduled report', [
                    'id' => $report->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->logInfo('Processed due scheduled reports', ['count' => $processedCount]);

        return $processedCount;
    }

    private function calculateNextRun(string $frequency): Carbon
    {
        return match ($frequency) {
            'daily' => now()->addDay(),
            'weekly' => now()->addWeek(),
            'monthly' => now()->addMonth(),
            'quarterly' => now()->addMonths(3),
            'yearly' => now()->addYear(),
            default => now()->addDay(),
        };
    }
}
