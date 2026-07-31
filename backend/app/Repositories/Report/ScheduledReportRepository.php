<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\Models\Report\ScheduledReport;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ScheduledReportRepository implements ScheduledReportRepositoryInterface
{
    public function __construct(
        protected ScheduledReport $model = new ScheduledReport,
    ) {
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = $this->model->query()->with('createdBy');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('report_name', 'LIKE', "%{$search}%");
        }

        if (! empty($filters['report_type'])) {
            $query->where('report_type', $filters['report_type']);
        }

        if (! empty($filters['frequency'])) {
            $query->where('frequency', $filters['frequency']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['export_format'])) {
            $query->where('export_format', $filters['export_format']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?ScheduledReport
    {
        return $this->model->with('createdBy')->find($id);
    }

    public function create(array $data): ScheduledReport
    {
        if (empty($data['next_run'])) {
            $data['next_run'] = $this->calculateNextRun(
                $data['frequency'] ?? 'daily'
            );
        }

        return $this->model->create($data);
    }

    public function update(ScheduledReport $report, array $data): ScheduledReport
    {
        $report->update($data);

        return $report->fresh();
    }

    public function delete(ScheduledReport $report): bool
    {
        return $report->delete();
    }

    public function getDueReports(): Collection
    {
        return $this->model->query()
            ->where('status', 'active')
            ->where('next_run', '<=', Carbon::now())
            ->get();
    }

    private function calculateNextRun(string $frequency): Carbon
    {
        $now = Carbon::now();

        return match ($frequency) {
            'daily' => $now->copy()->addDay()->startOfDay(),
            'weekly' => $now->copy()->addWeek()->startOfDay(),
            'monthly' => $now->copy()->addMonth()->startOfDay(),
            'quarterly' => $now->copy()->addMonths(3)->startOfDay(),
            'yearly' => $now->copy()->addYear()->startOfDay(),
            default => $now->copy()->addDay()->startOfDay(),
        };
    }
}
