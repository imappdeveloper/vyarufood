<?php

declare(strict_types=1);

namespace App\Services\DeliveryZone;

use App\DTOs\DeliveryZone\DeliveryZoneDTO;
use App\Models\Master\DeliveryZone;
use App\Repositories\DeliveryZone\DeliveryZoneRepositoryInterface;
use App\Services\Pincode\PincodeServiceInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DeliveryZoneService extends BaseService implements DeliveryZoneServiceInterface
{
    protected string $moduleName = 'delivery_zone';

    public function __construct(
        protected DeliveryZoneRepositoryInterface $deliveryZoneRepo,
        protected PincodeServiceInterface $pincodeService,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->deliveryZoneRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('delivery_zone', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->deliveryZoneRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('delivery_zone', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->deliveryZoneRepo->getActive();
        });
    }

    public function getDefault(): ?DeliveryZone
    {
        $cacheKey = CacheManager::cacheKey('delivery_zone', 'default');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->deliveryZoneRepo->getDefault();
        });
    }

    public function findById(int $id): ?DeliveryZone
    {
        return $this->deliveryZoneRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?DeliveryZone
    {
        return $this->deliveryZoneRepo->findByUuid($uuid);
    }

    public function create(array $data): DeliveryZone
    {
        return $this->transaction(function () use ($data) {
            $dto = DeliveryZoneDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $deliveryZone = $this->deliveryZoneRepo->create($dto, $createdBy);

            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zone created', ['delivery_zone_id' => $deliveryZone->id, 'zone_name' => $deliveryZone->zone_name]);
            $this->logActivity('delivery_zone_created', $deliveryZone);

            return $deliveryZone;
        });
    }

    public function update(DeliveryZone $deliveryZone, array $data): DeliveryZone
    {
        return $this->transaction(function () use ($deliveryZone, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $deliveryZone = $this->deliveryZoneRepo->update($deliveryZone, $data, $updatedBy);

            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zone updated', ['delivery_zone_id' => $deliveryZone->id, 'zone_name' => $deliveryZone->zone_name]);
            $this->logActivity('delivery_zone_updated', $deliveryZone);

            return $deliveryZone;
        });
    }

    public function delete(DeliveryZone $deliveryZone): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->deliveryZoneRepo->softDelete($deliveryZone, $deletedBy);

        if ($result) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zone deleted', ['delivery_zone_id' => $deliveryZone->id, 'zone_name' => $deliveryZone->zone_name]);
            $this->logActivity('delivery_zone_deleted', $deliveryZone);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->deliveryZoneRepo->restore($id);

        if ($result) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zone restored', ['delivery_zone_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(DeliveryZone $deliveryZone): bool
    {
        $result = $this->deliveryZoneRepo->forceDelete($deliveryZone);

        if ($result) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zone force deleted', ['delivery_zone_id' => $deliveryZone->id, 'zone_name' => $deliveryZone->zone_name]);
            $this->logActivity('delivery_zone_force_deleted', $deliveryZone);
        }

        return $result;
    }

    public function setStatus(DeliveryZone $deliveryZone, string $status): DeliveryZone
    {
        $deliveryZone = $this->deliveryZoneRepo->setStatus($deliveryZone, $status);

        CacheManager::flush('delivery_zone');

        $this->logInfo('Delivery zone status changed', ['delivery_zone_id' => $deliveryZone->id, 'status' => $status]);
        $this->logActivity('delivery_zone_status_changed', $deliveryZone, ['status' => $status]);

        return $deliveryZone;
    }

    public function setDefault(DeliveryZone $deliveryZone): bool
    {
        $result = $this->deliveryZoneRepo->setDefault($deliveryZone);

        if ($result) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zone set as default', ['delivery_zone_id' => $deliveryZone->id, 'zone_name' => $deliveryZone->zone_name]);
            $this->logActivity('delivery_zone_set_default', $deliveryZone);
        }

        return $result;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->deliveryZoneRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Bulk delivery zones deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->deliveryZoneRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Bulk delivery zones status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->deliveryZoneRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('delivery_zone');

            $this->logInfo('Delivery zones imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->deliveryZoneRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'country_id', 'state_id', 'city_id', 'area_id', 'zone_name', 'zone_code',
            'description', 'delivery_radius', 'minimum_order_amount', 'delivery_charge',
            'free_delivery_above', 'estimated_delivery_time', 'maximum_orders_per_slot',
            'priority', 'status', 'is_default', 'remarks',
        ];

        $sampleRow = [
            '1', '1', '1', '1', 'Mumbai Central', 'MUM-C', 'Central Mumbai delivery zone',
            '5.00', '200.00', '30.00', '500.00', '45', '100', '1', 'active', 'Yes', 'Primary zone',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->deliveryZoneRepo->countByStatus();
    }

    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('delivery_zone', "active_city_{$cityId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($cityId) {
            return $this->deliveryZoneRepo->getActiveByCity($cityId);
        });
    }

    public function checkServiceArea(array $data): bool
    {
        $areaId = $data['area_id'] ?? null;
        $pincode = $data['pincode'] ?? null;

        if ($areaId) {
            $zone = $this->deliveryZoneRepo->getActive()->first(fn (DeliveryZone $z) => (int) $z->area_id === (int) $areaId);
        } elseif ($pincode) {
            $pincodeRecord = $this->pincodeService->findByPincode($pincode);
            $zone = $pincodeRecord?->deliveryZone;
        } else {
            return false;
        }

        if (! $zone || ! $zone->relationLoaded('deliverySlots')) {
            $zone?->load('deliverySlots');
        }

        $availableSlots = $zone?->deliverySlots?->filter(fn ($slot) => $slot->status === 'active') ?? collect();

        return [
            'service_available' => $zone !== null && $availableSlots->isNotEmpty(),
            'delivery_charge' => $zone?->delivery_charge ?? 0,
            'minimum_order' => $zone?->minimum_order_amount ?? 0,
            'estimated_time' => $zone?->estimated_delivery_time ?? null,
            'available_slots' => $availableSlots->values(),
        ];
    }
}
