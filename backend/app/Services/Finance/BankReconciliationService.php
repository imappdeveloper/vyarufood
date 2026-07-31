<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\BankReconciliation;
use App\Repositories\Finance\BankReconciliationRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BankReconciliationService extends BaseService implements BankReconciliationServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly BankReconciliationRepositoryInterface $repo,
    ) {}

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getById(int $id): ?BankReconciliation
    {
        return $this->repo->getById($id);
    }

    public function getByUuid(string $uuid): ?BankReconciliation
    {
        return $this->repo->getByUuid($uuid);
    }

    public function create(array $data): BankReconciliation
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;
            $data['updated_by'] = $adminId;
            $data['status'] = $data['status'] ?? 'pending';

            $reconciliation = $this->repo->create($data);

            $this->logInfo('Bank reconciliation created', ['reconciliation_id' => $reconciliation->id, 'number' => $reconciliation->reconciliation_number]);

            return $reconciliation;
        });
    }

    public function completeReconciliation(string $uuid, int $reconciledBy): BankReconciliation
    {
        return $this->transaction(function () use ($uuid, $reconciledBy) {
            $reconciliation = $this->repo->getByUuid($uuid);

            if (! $reconciliation) {
                throw new \RuntimeException('Bank reconciliation not found.');
            }

            if ($reconciliation->status === 'completed') {
                throw new \RuntimeException('Reconciliation is already completed.');
            }

            if (abs($reconciliation->difference) > 0.01) {
                throw new \RuntimeException('Cannot complete reconciliation with a difference of ' . $reconciliation->difference);
            }

            $this->repo->update($reconciliation->id, [
                'status' => 'completed',
                'reconciled_at' => now(),
                'reconciled_by' => $reconciledBy,
                'updated_by' => $reconciledBy,
            ]);

            $this->logInfo('Bank reconciliation completed', ['reconciliation_id' => $reconciliation->id, 'reconciled_by' => $reconciledBy]);

            return $this->repo->getById($reconciliation->id);
        });
    }
}
