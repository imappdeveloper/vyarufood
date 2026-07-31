<?php

declare(strict_types=1);

namespace App\Services\State;

use App\DTOs\State\StateDTO;
use App\Models\Master\State;
use App\Repositories\State\StateRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StateService extends BaseService implements StateServiceInterface
{
    protected string $moduleName = 'state';

    public function __construct(
        protected StateRepositoryInterface $stateRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->stateRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('state', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->stateRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('state', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->stateRepo->getActive();
        });
    }

    public function getDefault(): ?State
    {
        $cacheKey = CacheManager::cacheKey('state', 'default');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->stateRepo->getDefault();
        });
    }

    public function findById(int $id): ?State
    {
        return $this->stateRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?State
    {
        return $this->stateRepo->findByUuid($uuid);
    }

    public function create(array $data): State
    {
        return $this->transaction(function () use ($data) {
            $dto = StateDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $state = $this->stateRepo->create($dto, $createdBy);

            CacheManager::flush('state');

            $this->logInfo('State created', ['state_id' => $state->id, 'name' => $state->name]);
            $this->logActivity('state_created', $state);

            return $state;
        });
    }

    public function update(State $state, array $data): State
    {
        return $this->transaction(function () use ($state, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $state = $this->stateRepo->update($state, $data, $updatedBy);

            CacheManager::flush('state');

            $this->logInfo('State updated', ['state_id' => $state->id, 'name' => $state->name]);
            $this->logActivity('state_updated', $state);

            return $state;
        });
    }

    public function delete(State $state): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->stateRepo->softDelete($state, $deletedBy);

        if ($result) {
            CacheManager::flush('state');

            $this->logInfo('State deleted', ['state_id' => $state->id, 'name' => $state->name]);
            $this->logActivity('state_deleted', $state);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->stateRepo->restore($id);

        if ($result) {
            CacheManager::flush('state');

            $this->logInfo('State restored', ['state_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(State $state): bool
    {
        $result = $this->stateRepo->forceDelete($state);

        if ($result) {
            CacheManager::flush('state');

            $this->logInfo('State force deleted', ['state_id' => $state->id, 'name' => $state->name]);
            $this->logActivity('state_force_deleted', $state);
        }

        return $result;
    }

    public function setStatus(State $state, string $status): State
    {
        $state = $this->stateRepo->setStatus($state, $status);

        CacheManager::flush('state');

        $this->logInfo('State status changed', ['state_id' => $state->id, 'status' => $status]);
        $this->logActivity('state_status_changed', $state, ['status' => $status]);

        return $state;
    }

    public function setDefault(State $state): bool
    {
        $result = $this->stateRepo->setDefault($state);

        if ($result) {
            CacheManager::flush('state');

            $this->logInfo('State set as default', ['state_id' => $state->id, 'name' => $state->name]);
            $this->logActivity('state_set_default', $state);
        }

        return $result;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->stateRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('state');

            $this->logInfo('Bulk states deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->stateRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('state');

            $this->logInfo('Bulk states status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->stateRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('state');

            $this->logInfo('States imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->stateRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'country_id', 'name', 'state_code', 'abbreviation', 'gst_code',
            'latitude', 'longitude', 'status', 'sort_order',
        ];

        $sampleRow = [
            '1', 'Maharashtra', 'MH', 'MH', '27',
            '19.7515', '75.7139', 'active', '0',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->stateRepo->countByStatus();
    }
}
