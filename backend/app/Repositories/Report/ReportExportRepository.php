<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\Models\Report\ReportExport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReportExportRepository implements ReportExportRepositoryInterface
{
    public function __construct(
        protected ReportExport $model = new ReportExport,
    ) {
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = $this->model->query()->with('createdBy');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('report_name', 'LIKE', "%{$search}%");
        }

        if (! empty($filters['export_format'])) {
            $query->where('export_format', $filters['export_format']);
        }

        if (! empty($filters['generated_by'])) {
            $query->where('generated_by', $filters['generated_by']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('generated_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('generated_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?ReportExport
    {
        return $this->model->with('createdBy')->find($id);
    }

    public function create(array $data): ReportExport
    {
        $data['generated_at'] = $data['generated_at'] ?? now();

        return $this->model->create($data);
    }
}
