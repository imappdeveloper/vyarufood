<?php

declare(strict_types=1);

namespace App\Services\Area;

use App\DTOs\Area\AreaDTO;
use App\Models\Master\Area;
use App\Repositories\Area\AreaRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AreaService extends BaseService implements AreaServiceInterface
{
    protected string $moduleName = 'area';

    public function __construct(
        protected AreaRepositoryInterface $areaRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->areaRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('area', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->areaRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('area', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->areaRepo->getActive();
        });
    }

    public function getDefault(): ?Area
    {
        $cacheKey = CacheManager::cacheKey('area', 'default');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->areaRepo->getDefault();
        });
    }

    public function findById(int $id): ?Area
    {
        return $this->areaRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?Area
    {
        return $this->areaRepo->findByUuid($uuid);
    }

    public function create(array $data): Area
    {
        return $this->transaction(function () use ($data) {
            $dto = AreaDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $area = $this->areaRepo->create($dto, $createdBy);

            CacheManager::flush('area');

            $this->logInfo('Area created', ['area_id' => $area->id, 'name' => $area->name]);
            $this->logActivity('area_created', $area);

            return $area;
        });
    }

    public function update(Area $area, array $data): Area
    {
        return $this->transaction(function () use ($area, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $area = $this->areaRepo->update($area, $data, $updatedBy);

            CacheManager::flush('area');

            $this->logInfo('Area updated', ['area_id' => $area->id, 'name' => $area->name]);
            $this->logActivity('area_updated', $area);

            return $area;
        });
    }

    public function delete(Area $area): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->areaRepo->softDelete($area, $deletedBy);

        if ($result) {
            CacheManager::flush('area');

            $this->logInfo('Area deleted', ['area_id' => $area->id, 'name' => $area->name]);
            $this->logActivity('area_deleted', $area);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->areaRepo->restore($id);

        if ($result) {
            CacheManager::flush('area');

            $this->logInfo('Area restored', ['area_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(Area $area): bool
    {
        $result = $this->areaRepo->forceDelete($area);

        if ($result) {
            CacheManager::flush('area');

            $this->logInfo('Area force deleted', ['area_id' => $area->id, 'name' => $area->name]);
            $this->logActivity('area_force_deleted', $area);
        }

        return $result;
    }

    public function setStatus(Area $area, string $status): Area
    {
        $area = $this->areaRepo->setStatus($area, $status);

        CacheManager::flush('area');

        $this->logInfo('Area status changed', ['area_id' => $area->id, 'status' => $status]);
        $this->logActivity('area_status_changed', $area, ['status' => $status]);

        return $area;
    }

    public function setServiceable(Area $area, bool $isServiceable): Area
    {
        $area = $this->areaRepo->setServiceable($area, $isServiceable);

        CacheManager::flush('area');

        $event = $isServiceable ? 'area_service_enabled' : 'area_service_disabled';
        $this->logInfo("Area service " . ($isServiceable ? 'enabled' : 'disabled'), ['area_id' => $area->id]);
        $this->logActivity($event, $area, ['is_serviceable' => $isServiceable]);

        return $area;
    }

    public function setDefault(Area $area): bool
    {
        $result = $this->areaRepo->setDefault($area);

        if ($result) {
            CacheManager::flush('area');

            $this->logInfo('Area set as default', ['area_id' => $area->id, 'name' => $area->name]);
            $this->logActivity('area_set_default', $area);
        }

        return $result;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->areaRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('area');

            $this->logInfo('Bulk areas deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->areaRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('area');

            $this->logInfo('Bulk areas status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->areaRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('area');

            $this->logInfo('Areas imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->areaRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'country_id', 'state_id', 'city_id', 'name', 'area_code', 'postal_zone',
            'latitude', 'longitude', 'delivery_radius', 'minimum_order_amount',
            'delivery_charge', 'estimated_delivery_time', 'is_serviceable', 'status',
        ];

        $sampleRow = [
            '1', '1', '1', 'Andheri West', 'AND-W', '400058', '19.1364', '72.8296',
            '5.00', '150.00', '20.00', '30', 'Yes', 'active',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->areaRepo->countByStatus();
    }

    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('area', "active_city_{$cityId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($cityId) {
            return $this->areaRepo->getActiveByCity($cityId);
        });
    }
}
