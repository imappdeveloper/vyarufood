<?php

declare(strict_types=1);

namespace App\Services\City;

use App\DTOs\City\CityDTO;
use App\Models\Master\City;
use App\Repositories\City\CityRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CityService extends BaseService implements CityServiceInterface
{
    protected string $moduleName = 'city';

    public function __construct(
        protected CityRepositoryInterface $cityRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->cityRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('city', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->cityRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('city', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->cityRepo->getActive();
        });
    }

    public function getDefault(): ?City
    {
        $cacheKey = CacheManager::cacheKey('city', 'default');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->cityRepo->getDefault();
        });
    }

    public function findById(int $id): ?City
    {
        return $this->cityRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?City
    {
        return $this->cityRepo->findByUuid($uuid);
    }

    public function create(array $data): City
    {
        return $this->transaction(function () use ($data) {
            $dto = CityDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $city = $this->cityRepo->create($dto, $createdBy);

            CacheManager::flush('city');

            $this->logInfo('City created', ['city_id' => $city->id, 'name' => $city->name]);
            $this->logActivity('city_created', $city);

            return $city;
        });
    }

    public function update(City $city, array $data): City
    {
        return $this->transaction(function () use ($city, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $city = $this->cityRepo->update($city, $data, $updatedBy);

            CacheManager::flush('city');

            $this->logInfo('City updated', ['city_id' => $city->id, 'name' => $city->name]);
            $this->logActivity('city_updated', $city);

            return $city;
        });
    }

    public function delete(City $city): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->cityRepo->softDelete($city, $deletedBy);

        if ($result) {
            CacheManager::flush('city');

            $this->logInfo('City deleted', ['city_id' => $city->id, 'name' => $city->name]);
            $this->logActivity('city_deleted', $city);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->cityRepo->restore($id);

        if ($result) {
            CacheManager::flush('city');

            $this->logInfo('City restored', ['city_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(City $city): bool
    {
        $result = $this->cityRepo->forceDelete($city);

        if ($result) {
            CacheManager::flush('city');

            $this->logInfo('City force deleted', ['city_id' => $city->id, 'name' => $city->name]);
            $this->logActivity('city_force_deleted', $city);
        }

        return $result;
    }

    public function setStatus(City $city, string $status): City
    {
        $city = $this->cityRepo->setStatus($city, $status);

        CacheManager::flush('city');

        $this->logInfo('City status changed', ['city_id' => $city->id, 'status' => $status]);
        $this->logActivity('city_status_changed', $city, ['status' => $status]);

        return $city;
    }

    public function setDefault(City $city): bool
    {
        $result = $this->cityRepo->setDefault($city);

        if ($result) {
            CacheManager::flush('city');

            $this->logInfo('City set as default', ['city_id' => $city->id, 'name' => $city->name]);
            $this->logActivity('city_set_default', $city);
        }

        return $result;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->cityRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('city');

            $this->logInfo('Bulk cities deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->cityRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('city');

            $this->logInfo('Bulk cities status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->cityRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('city');

            $this->logInfo('Cities imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->cityRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'country_id', 'state_id', 'name', 'city_code', 'latitude', 'longitude',
            'timezone', 'population', 'display_order', 'is_metro', 'status',
        ];

        $sampleRow = [
            '1', '1', 'Mumbai', 'MUM', '19.0760', '72.8777',
            'Asia/Kolkata', '12442373', '0', 'Yes', 'active',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->cityRepo->countByStatus();
    }

    public function getActiveByCountry(int $countryId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('city', "active_country_{$countryId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($countryId) {
            return $this->cityRepo->getActiveByCountry($countryId);
        });
    }

    public function getActiveByState(int $stateId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('city', "active_state_{$stateId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($stateId) {
            return $this->cityRepo->getActiveByState($stateId);
        });
    }
}
