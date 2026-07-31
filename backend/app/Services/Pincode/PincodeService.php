<?php

declare(strict_types=1);

namespace App\Services\Pincode;

use App\DTOs\Pincode\PincodeDTO;
use App\Models\Master\Pincode;
use App\Repositories\Pincode\PincodeRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PincodeService extends BaseService implements PincodeServiceInterface
{
    protected string $moduleName = 'pincode';

    public function __construct(
        protected PincodeRepositoryInterface $pincodeRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->pincodeRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('pincode', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->pincodeRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('pincode', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->pincodeRepo->getActive();
        });
    }

    public function findById(int $id): ?Pincode
    {
        return $this->pincodeRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?Pincode
    {
        return $this->pincodeRepo->findByUuid($uuid);
    }

    public function findByPincode(string $pincode): ?Pincode
    {
        return $this->pincodeRepo->findByPincode($pincode);
    }

    public function create(array $data): Pincode
    {
        return $this->transaction(function () use ($data) {
            $dto = PincodeDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $pincode = $this->pincodeRepo->create($dto, $createdBy);

            CacheManager::flush('pincode');

            $this->logInfo('Pincode created', ['pincode_id' => $pincode->id, 'pincode' => $pincode->pincode]);
            $this->logActivity('pincode_created', $pincode);

            return $pincode;
        });
    }

    public function update(Pincode $pincode, array $data): Pincode
    {
        return $this->transaction(function () use ($pincode, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $pincode = $this->pincodeRepo->update($pincode, $data, $updatedBy);

            CacheManager::flush('pincode');

            $this->logInfo('Pincode updated', ['pincode_id' => $pincode->id, 'pincode' => $pincode->pincode]);
            $this->logActivity('pincode_updated', $pincode);

            return $pincode;
        });
    }

    public function delete(Pincode $pincode): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->pincodeRepo->softDelete($pincode, $deletedBy);

        if ($result) {
            CacheManager::flush('pincode');

            $this->logInfo('Pincode deleted', ['pincode_id' => $pincode->id, 'pincode' => $pincode->pincode]);
            $this->logActivity('pincode_deleted', $pincode);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->pincodeRepo->restore($id);

        if ($result) {
            CacheManager::flush('pincode');

            $this->logInfo('Pincode restored', ['pincode_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(Pincode $pincode): bool
    {
        $result = $this->pincodeRepo->forceDelete($pincode);

        if ($result) {
            CacheManager::flush('pincode');

            $this->logInfo('Pincode force deleted', ['pincode_id' => $pincode->id, 'pincode' => $pincode->pincode]);
            $this->logActivity('pincode_force_deleted', $pincode);
        }

        return $result;
    }

    public function setStatus(Pincode $pincode, string $status): Pincode
    {
        $pincode = $this->pincodeRepo->setStatus($pincode, $status);

        CacheManager::flush('pincode');

        $this->logInfo('Pincode status changed', ['pincode_id' => $pincode->id, 'status' => $status]);
        $this->logActivity('pincode_status_changed', $pincode, ['status' => $status]);

        return $pincode;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->pincodeRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('pincode');

            $this->logInfo('Bulk pincodes deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->pincodeRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('pincode');

            $this->logInfo('Bulk pincodes status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->pincodeRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('pincode');

            $this->logInfo('Pincodes imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->pincodeRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'delivery_zone_id', 'country_id', 'state_id', 'city_id', 'area_id',
            'pincode', 'office_name', 'district', 'latitude', 'longitude',
            'status', 'is_serviceable',
        ];

        $sampleRow = [
            '1', '1', '1', '1', '1', '400058', 'Andheri West', 'Mumbai',
            '19.1364', '72.8296', 'active', 'Yes',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->pincodeRepo->countByStatus();
    }

    public function getActiveByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('pincode', "active_zone_{$zoneId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($zoneId) {
            return $this->pincodeRepo->getActiveByZone($zoneId);
        });
    }
}
