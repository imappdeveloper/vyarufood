<?php

declare(strict_types=1);

namespace App\Services\DeliveryZone;

use App\Models\Master\DeliverySlot;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DeliverySlotServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order, ?int $zoneId = null): LengthAwarePaginator;
    public function getAllByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection;
    public function getActiveByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection;
    public function findById(int $id): ?DeliverySlot;
    public function findByUuid(string $uuid): ?DeliverySlot;
    public function create(array $data): DeliverySlot;
    public function update(DeliverySlot $deliverySlot, array $data): DeliverySlot;
    public function delete(DeliverySlot $deliverySlot): bool;
    public function restore(int $id): bool;
    public function forceDelete(DeliverySlot $deliverySlot): bool;
    public function setStatus(DeliverySlot $deliverySlot, string $status): DeliverySlot;
    public function getAvailableSlots(int $zoneId): \Illuminate\Database\Eloquent\Collection;
}
