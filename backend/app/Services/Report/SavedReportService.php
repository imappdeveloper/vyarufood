<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\Report\SavedReport;
use App\Repositories\Report\SavedReportRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SavedReportService extends BaseService implements SavedReportServiceInterface
{
    protected string $moduleName = 'SavedReportService';

    public function __construct(
        protected SavedReportRepositoryInterface $repo,
    ) {}

    public function getSavedReports(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getSavedReport(int $id): ?SavedReport
    {
        return $this->repo->findById($id);
    }

    public function createSavedReport(array $data): SavedReport
    {
        return $this->transaction(function () use ($data) {
            $data['created_by'] = auth()->guard('admin')->id();

            $report = $this->repo->create($data);

            $this->logInfo('Saved report created', ['id' => $report->id, 'code' => $report->report_code]);

            return $report;
        });
    }

    public function updateSavedReport(int $id, array $data): SavedReport
    {
        return $this->transaction(function () use ($id, $data) {
            $report = $this->repo->findById($id);

            if (! $report) {
                throw new \App\Exceptions\ModelNotFoundException("Saved report not found");
            }

            $report = $this->repo->update($report, $data);

            $this->logInfo('Saved report updated', ['id' => $report->id]);

            return $report;
        });
    }

    public function deleteSavedReport(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $report = $this->repo->findById($id);

            if (! $report) {
                throw new \App\Exceptions\ModelNotFoundException("Saved report not found");
            }

            $result = $this->repo->delete($report);

            $this->logInfo('Saved report deleted', ['id' => $id]);

            return $result;
        });
    }
}
