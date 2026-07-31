<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\Models\Report\SavedReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SavedReportRepository implements SavedReportRepositoryInterface
{
    public function __construct(
        protected SavedReport $model = new SavedReport,
    ) {
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = $this->model->query()->with('createdBy');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('report_code', 'LIKE', "%{$search}%")
                    ->orWhere('report_name', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['report_type'])) {
            $query->where('report_type', $filters['report_type']);
        }

        if (isset($filters['is_public']) && $filters['is_public'] !== '') {
            $query->where('is_public', filter_var($filters['is_public'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['created_by'])) {
            $query->where('created_by', $filters['created_by']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?SavedReport
    {
        return $this->model->with('createdBy')->find($id);
    }

    public function findByCode(string $code): ?SavedReport
    {
        return $this->model->where('report_code', $code)->with('createdBy')->first();
    }

    public function create(array $data): SavedReport
    {
        return $this->model->create($data);
    }

    public function update(SavedReport $report, array $data): SavedReport
    {
        $report->update($data);

        return $report->fresh();
    }

    public function delete(SavedReport $report): bool
    {
        return $report->delete();
    }
}
