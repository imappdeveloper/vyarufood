<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\FinancialYear;
use App\Repositories\Finance\FinancialYearRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FinancialYearService extends BaseService implements FinancialYearServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly FinancialYearRepositoryInterface $repo,
    ) {}

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getById(int $id): ?FinancialYear
    {
        return $this->repo->getById($id);
    }

    public function getByUuid(string $uuid): ?FinancialYear
    {
        return $this->repo->getByUuid($uuid);
    }

    public function create(array $data): FinancialYear
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;
            $data['updated_by'] = $adminId;

            if (! isset($data['is_current'])) {
                $data['is_current'] = true;
            }

            if ($data['is_current']) {
                FinancialYear::where('is_current', true)->update(['is_current' => false]);
            }

            $fy = $this->repo->create($data);

            $this->logInfo('Financial year created', ['fy_id' => $fy->id, 'name' => $fy->year_name]);

            return $fy;
        });
    }

    public function update(int $id, array $data): FinancialYear
    {
        return $this->transaction(function () use ($id, $data) {
            $fy = $this->repo->getById($id);

            if (! $fy) {
                throw new \RuntimeException('Financial year not found.');
            }

            if ($fy->is_closed) {
                throw new \RuntimeException('Cannot edit a closed financial year.');
            }

            $adminId = auth()->guard('admin')->id();
            $data['updated_by'] = $adminId;

            $this->repo->update($id, $data);

            $this->logInfo('Financial year updated', ['fy_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function getCurrent(): ?FinancialYear
    {
        return $this->repo->getCurrent();
    }

    public function closeYear(string $uuid, int $closedBy, ?string $remarks): FinancialYear
    {
        return $this->transaction(function () use ($uuid, $closedBy, $remarks) {
            $fy = $this->repo->getByUuid($uuid);

            if (! $fy) {
                throw new \RuntimeException('Financial year not found.');
            }

            if ($fy->is_closed) {
                throw new \RuntimeException('Financial year is already closed.');
            }

            $this->repo->update($fy->id, [
                'is_closed' => true,
                'is_current' => false,
                'closed_at' => now(),
                'closed_by' => $closedBy,
                'remarks' => $remarks,
                'updated_by' => $closedBy,
            ]);

            $this->logInfo('Financial year closed', ['fy_id' => $fy->id, 'closed_by' => $closedBy]);

            return $this->repo->getById($fy->id);
        });
    }
}
