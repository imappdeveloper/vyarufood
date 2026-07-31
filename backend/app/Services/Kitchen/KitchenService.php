<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\DTOs\Kitchen\KitchenDTO;
use App\Models\Kitchen;
use App\Repositories\Kitchen\KitchenRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenService extends BaseService implements KitchenServiceInterface
{
    protected string $moduleName = 'kitchen';

    public function __construct(
        protected KitchenRepositoryInterface $kitchenRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->kitchenRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        $cacheKey = CacheManager::cacheKey('kitchen', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->kitchenRepo->getAll();
        });
    }

    public function getActive(): Collection
    {
        $cacheKey = CacheManager::cacheKey('kitchen', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->kitchenRepo->getActive();
        });
    }

    public function getById(int $id): ?Kitchen
    {
        return $this->kitchenRepo->getById($id);
    }

    public function findByUuid(string $uuid): ?Kitchen
    {
        return $this->kitchenRepo->findByUuid($uuid);
    }

    public function create(array $data): Kitchen
    {
        return $this->transaction(function () use ($data) {
            $dto = KitchenDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $kitchen = $this->kitchenRepo->create($dto, $createdBy);

            CacheManager::flush('kitchen');

            $this->logInfo('Kitchen created', ['kitchen_id' => $kitchen->id, 'kitchen_code' => $kitchen->kitchen_code]);
            $this->logActivity('kitchen_created', $kitchen);

            return $kitchen;
        });
    }

    public function update(Kitchen $kitchen, array $data): Kitchen
    {
        return $this->transaction(function () use ($kitchen, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $kitchen = $this->kitchenRepo->update($kitchen, $data, $updatedBy);

            CacheManager::flush('kitchen');

            $this->logInfo('Kitchen updated', ['kitchen_id' => $kitchen->id]);
            $this->logActivity('kitchen_updated', $kitchen);

            return $kitchen;
        });
    }

    public function delete(Kitchen $kitchen): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->kitchenRepo->softDelete($kitchen, $deletedBy);

        if ($result) {
            CacheManager::flush('kitchen');

            $this->logInfo('Kitchen deleted', ['kitchen_id' => $kitchen->id]);
            $this->logActivity('kitchen_deleted', $kitchen);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->kitchenRepo->restore($id);

        if ($result) {
            CacheManager::flush('kitchen');

            $this->logInfo('Kitchen restored', ['kitchen_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(Kitchen $kitchen): bool
    {
        $result = $this->kitchenRepo->forceDelete($kitchen);

        if ($result) {
            CacheManager::flush('kitchen');

            $this->logInfo('Kitchen force deleted', ['kitchen_id' => $kitchen->id]);
        }

        return $result;
    }

    public function setDefault(Kitchen $kitchen): Kitchen
    {
        $kitchen = $this->kitchenRepo->setDefault($kitchen);

        CacheManager::flush('kitchen');

        $this->logInfo('Kitchen set as default', ['kitchen_id' => $kitchen->id]);
        $this->logActivity('kitchen_default_changed', $kitchen);

        return $kitchen;
    }

    public function setStatus(Kitchen $kitchen, string $status): Kitchen
    {
        $kitchen = $this->kitchenRepo->setStatus($kitchen, $status);

        CacheManager::flush('kitchen');

        $this->logInfo('Kitchen status changed', ['kitchen_id' => $kitchen->id, 'status' => $status]);
        $this->logActivity($status === 'active' ? 'kitchen_activated' : 'kitchen_deactivated', $kitchen, ['status' => $status]);

        return $kitchen;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->kitchenRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('kitchen');

            $this->logInfo('Bulk kitchens deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->kitchenRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('kitchen');

            $this->logInfo('Bulk kitchens status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->kitchenRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('kitchen');

            $this->logInfo('Kitchens imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): Collection
    {
        return $this->kitchenRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'kitchen_code', 'name', 'description', 'kitchen_type',
            'manager_name', 'manager_mobile', 'manager_email',
            'address_line_1', 'address_line_2', 'landmark',
            'latitude', 'longitude', 'opening_time', 'closing_time',
            'preparation_start_time', 'accept_order_start_time', 'accept_order_end_time',
            'daily_capacity', 'maximum_orders', 'emergency_contact',
            'license_number', 'fssai_number', 'gst_number',
            'status', 'is_default',
        ];

        $sampleRow = [
            'KIT-001', 'Main Kitchen - Velachery', 'Primary kitchen for South Chennai', 'main_kitchen',
            'Rajesh Kumar', '9876543210', 'rajesh@tiffin.local',
            '42, Velachery Main Road', 'Velachery', 'Near Phoenix Mall',
            '13.0067', '80.2206', '06:00', '22:00',
            '05:00', '07:00', '21:00',
            '500', '200', '9876543211',
            'TN-2024-001', '10012011000001', '33AAACT1234F1Z5',
            'active', 'true',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', array_map(fn ($v) => '"' . str_replace('"', '""', $v) . '"', $sampleRow)) . "\n";

        return $csv;
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('kitchen', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return [
                'total_by_status' => $this->kitchenRepo->countByStatus(),
                'default_count' => $this->kitchenRepo->countDefault(),
            ];
        });
    }

    public function getDefault(): ?Kitchen
    {
        return $this->kitchenRepo->getDefault();
    }

    public function search(?string $search): Collection
    {
        return $this->kitchenRepo->search($search);
    }

    public function hasRelatedData(Kitchen $kitchen): bool
    {
        return $this->kitchenRepo->hasRelatedData($kitchen);
    }
}
