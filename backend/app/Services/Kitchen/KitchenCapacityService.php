<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\DTOs\Kitchen\KitchenCapacityDTO;
use App\Models\KitchenCapacity;
use App\Repositories\Kitchen\KitchenCapacityRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenCapacityService extends BaseService implements KitchenCapacityServiceInterface
{
    protected string $moduleName = 'kitchen_capacity';

    public function __construct(
        protected KitchenCapacityRepositoryInterface $repo,
    ) {}

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->repo->getPaginated($kitchenId, $filters, $perPage, $sort, $order);
    }

    public function getAll(int $kitchenId): Collection
    {
        $cacheKey = CacheManager::cacheKey('kitchen_capacity', "all:{$kitchenId}");

        return CacheManager::remember($cacheKey, 3600, fn () => $this->repo->getAll($kitchenId));
    }

    public function getById(int $id): ?KitchenCapacity
    {
        return $this->repo->getById($id);
    }

    public function findByUuid(string $uuid): ?KitchenCapacity
    {
        return $this->repo->findByUuid($uuid);
    }

    public function create(array $data): KitchenCapacity
    {
        return $this->transaction(function () use ($data) {
            if (empty($data['available_orders'])) {
                $data['available_orders'] = ($data['maximum_orders'] ?? 0) - ($data['reserved_orders'] ?? 0);
            }

            $dto = KitchenCapacityDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $capacity = $this->repo->create($dto->toArray(), $createdBy);

            CacheManager::flush('kitchen_capacity');

            $this->logInfo('Capacity created', ['id' => $capacity->id, 'date' => $capacity->capacity_date]);
            $this->logActivity('capacity_created', $capacity);

            return $capacity;
        });
    }

    public function update(KitchenCapacity $capacity, array $data): KitchenCapacity
    {
        return $this->transaction(function () use ($capacity, $data) {
            if (isset($data['maximum_orders']) || isset($data['reserved_orders'])) {
                $max = $data['maximum_orders'] ?? $capacity->maximum_orders;
                $reserved = $data['reserved_orders'] ?? $capacity->reserved_orders;
                $data['available_orders'] = $max - $reserved;
            }

            $updatedBy = auth()->guard('admin')->id();
            $capacity = $this->repo->update($capacity, $data, $updatedBy);

            CacheManager::flush('kitchen_capacity');

            $this->logInfo('Capacity updated', ['id' => $capacity->id]);
            $this->logActivity('capacity_updated', $capacity);

            return $capacity;
        });
    }

    public function delete(KitchenCapacity $capacity): bool
    {
        $result = $this->repo->delete($capacity);

        if ($result) {
            CacheManager::flush('kitchen_capacity');
            $this->logInfo('Capacity deleted', ['id' => $capacity->id]);
            $this->logActivity('capacity_deleted', $capacity);
        }

        return $result;
    }

    public function getByDate(int $kitchenId, string $date): ?KitchenCapacity
    {
        $cacheKey = CacheManager::cacheKey('kitchen_capacity', "date:{$kitchenId}:{$date}");

        return CacheManager::remember($cacheKey, 300, fn () => $this->repo->getByDate($kitchenId, $date));
    }

    public function getForDateRange(int $kitchenId, string $from, string $to): Collection
    {
        return $this->repo->getForDateRange($kitchenId, $from, $to);
    }

    public function getUpcoming(int $kitchenId): Collection
    {
        return $this->repo->getUpcoming($kitchenId);
    }

    public function bulkUpdateCapacity(int $kitchenId, array $capacities): int
    {
        $count = 0;
        $updatedBy = auth()->guard('admin')->id();

        foreach ($capacities as $capData) {
            $capData['kitchen_id'] = $kitchenId;

            if (empty($capData['available_orders'])) {
                $capData['available_orders'] = ($capData['maximum_orders'] ?? 0) - ($capData['reserved_orders'] ?? 0);
            }

            $existing = $this->repo->getByDate($kitchenId, $capData['capacity_date']);

            if ($existing) {
                $this->repo->update($existing, $capData, $updatedBy);
            } else {
                $this->repo->create($capData, $updatedBy);
            }

            $count++;
        }

        if ($count > 0) {
            CacheManager::flush('kitchen_capacity');
            $this->logInfo('Bulk capacity updated', ['kitchen_id' => $kitchenId, 'count' => $count]);
        }

        return $count;
    }

    public function calculateAvailableOrders(int $kitchenId, string $date): int
    {
        $capacity = $this->getByDate($kitchenId, $date);

        return $capacity ? $capacity->available_orders : 0;
    }

    public function getCapacityStats(int $kitchenId): array
    {
        $cacheKey = CacheManager::cacheKey('kitchen_capacity', "stats:{$kitchenId}");

        return CacheManager::remember($cacheKey, 300, function () use ($kitchenId) {
            $upcoming = $this->repo->getUpcoming($kitchenId);

            return [
                'total_dates' => $upcoming->count(),
                'total_maximum' => $upcoming->sum('maximum_orders'),
                'total_reserved' => $upcoming->sum('reserved_orders'),
                'total_available' => $upcoming->sum('available_orders'),
                'avg_utilization' => $upcoming->sum('maximum_orders') > 0
                    ? round(($upcoming->sum('reserved_orders') / $upcoming->sum('maximum_orders')) * 100, 1)
                    : 0,
            ];
        });
    }
}
