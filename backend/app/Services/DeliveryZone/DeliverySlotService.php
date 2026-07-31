<?php

declare(strict_types=1);

namespace App\Services\DeliveryZone;

use App\DTOs\DeliveryZone\DeliverySlotDTO;
use App\Models\Master\DeliverySlot;
use App\Repositories\DeliveryZone\DeliverySlotRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DeliverySlotService extends BaseService implements DeliverySlotServiceInterface
{
    protected string $moduleName = 'delivery_slot';

    public function __construct(
        protected DeliverySlotRepositoryInterface $deliverySlotRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order, ?int $zoneId = null): LengthAwarePaginator
    {
        return $this->deliverySlotRepo->getPaginated($filters, $perPage, $sort, $order, $zoneId);
    }

    public function getAllByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('delivery_slot', "all_zone_{$zoneId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($zoneId) {
            return $this->deliverySlotRepo->getAllByZone($zoneId);
        });
    }

    public function getActiveByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('delivery_slot', "active_zone_{$zoneId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($zoneId) {
            return $this->deliverySlotRepo->getActiveByZone($zoneId);
        });
    }

    public function findById(int $id): ?DeliverySlot
    {
        return $this->deliverySlotRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?DeliverySlot
    {
        return $this->deliverySlotRepo->findByUuid($uuid);
    }

    public function create(array $data): DeliverySlot
    {
        return $this->transaction(function () use ($data) {
            $dto = DeliverySlotDTO::fromArray($data);

            $deliverySlot = $this->deliverySlotRepo->create($dto);

            CacheManager::flush('delivery_slot');

            $this->logInfo('Delivery slot created', ['delivery_slot_id' => $deliverySlot->id, 'slot_name' => $deliverySlot->slot_name]);
            $this->logActivity('delivery_slot_created', $deliverySlot);

            return $deliverySlot;
        });
    }

    public function update(DeliverySlot $deliverySlot, array $data): DeliverySlot
    {
        return $this->transaction(function () use ($deliverySlot, $data) {
            $deliverySlot = $this->deliverySlotRepo->update($deliverySlot, $data);

            CacheManager::flush('delivery_slot');

            $this->logInfo('Delivery slot updated', ['delivery_slot_id' => $deliverySlot->id, 'slot_name' => $deliverySlot->slot_name]);
            $this->logActivity('delivery_slot_updated', $deliverySlot);

            return $deliverySlot;
        });
    }

    public function delete(DeliverySlot $deliverySlot): bool
    {
        $result = $this->deliverySlotRepo->delete($deliverySlot);

        if ($result) {
            CacheManager::flush('delivery_slot');

            $this->logInfo('Delivery slot deleted', ['delivery_slot_id' => $deliverySlot->id, 'slot_name' => $deliverySlot->slot_name]);
            $this->logActivity('delivery_slot_deleted', $deliverySlot);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->deliverySlotRepo->restore($id);

        if ($result) {
            CacheManager::flush('delivery_slot');

            $this->logInfo('Delivery slot restored', ['delivery_slot_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(DeliverySlot $deliverySlot): bool
    {
        $result = $this->deliverySlotRepo->forceDelete($deliverySlot);

        if ($result) {
            CacheManager::flush('delivery_slot');

            $this->logInfo('Delivery slot force deleted', ['delivery_slot_id' => $deliverySlot->id, 'slot_name' => $deliverySlot->slot_name]);
            $this->logActivity('delivery_slot_force_deleted', $deliverySlot);
        }

        return $result;
    }

    public function setStatus(DeliverySlot $deliverySlot, string $status): DeliverySlot
    {
        $deliverySlot = $this->deliverySlotRepo->setStatus($deliverySlot, $status);

        CacheManager::flush('delivery_slot');

        $this->logInfo('Delivery slot status changed', ['delivery_slot_id' => $deliverySlot->id, 'status' => $status]);
        $this->logActivity('delivery_slot_status_changed', $deliverySlot, ['status' => $status]);

        return $deliverySlot;
    }

    public function getAvailableSlots(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('delivery_slot', "available_zone_{$zoneId}");

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () use ($zoneId) {
            return $this->deliverySlotRepo->getAvailableSlots($zoneId);
        });
    }
}
