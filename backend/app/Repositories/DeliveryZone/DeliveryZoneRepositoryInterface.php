<?php

declare(strict_types=1);

namespace App\Repositories\DeliveryZone;

use App\DTOs\DeliveryZone\DeliveryZoneDTO;
use App\Models\Master\DeliveryZone;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DeliveryZoneRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?DeliveryZone;
    public function findById(int $id): ?DeliveryZone;
    public function findByUuid(string $uuid): ?DeliveryZone;
    public function create(DeliveryZoneDTO $dto, int $createdBy): DeliveryZone;
    public function update(DeliveryZone $deliveryZone, array $data, int $updatedBy): DeliveryZone;
    public function softDelete(DeliveryZone $deliveryZone, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(DeliveryZone $deliveryZone): bool;
    public function setStatus(DeliveryZone $deliveryZone, string $status): DeliveryZone;
    public function setDefault(DeliveryZone $deliveryZone): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection;
    public function hasOrders(int $zoneId): bool;
    public function hasCustomers(int $zoneId): bool;
}
