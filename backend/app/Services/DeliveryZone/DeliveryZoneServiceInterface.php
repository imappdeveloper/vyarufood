<?php

declare(strict_types=1);

namespace App\Services\DeliveryZone;

use App\Models\Master\DeliveryZone;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DeliveryZoneServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?DeliveryZone;
    public function findById(int $id): ?DeliveryZone;
    public function findByUuid(string $uuid): ?DeliveryZone;
    public function create(array $data): DeliveryZone;
    public function update(DeliveryZone $deliveryZone, array $data): DeliveryZone;
    public function delete(DeliveryZone $deliveryZone): bool;
    public function restore(int $id): bool;
    public function forceDelete(DeliveryZone $deliveryZone): bool;
    public function setStatus(DeliveryZone $deliveryZone, string $status): DeliveryZone;
    public function setDefault(DeliveryZone $deliveryZone): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function downloadSampleTemplate(): string;
    public function countByStatus(): array;
    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection;
    public function checkServiceArea(array $data): bool;
}
