<?php

declare(strict_types=1);

namespace App\Repositories\Report;

use App\Models\Report\ReportExport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ReportExportRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function findById(int $id): ?ReportExport;
    public function create(array $data): ReportExport;
}
