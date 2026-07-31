<?php

declare(strict_types=1);

namespace App\Repositories\Area;

use App\DTOs\Area\AreaDTO;
use App\Models\Master\Area;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AreaRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?Area;
    public function findById(int $id): ?Area;
    public function findByUuid(string $uuid): ?Area;
    public function create(AreaDTO $dto, int $createdBy): Area;
    public function update(Area $area, array $data, int $updatedBy): Area;
    public function softDelete(Area $area, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(Area $area): bool;
    public function setStatus(Area $area, string $status): Area;
    public function setServiceable(Area $area, bool $isServiceable): Area;
    public function setDefault(Area $area): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection;
    public function hasCustomers(int $areaId): bool;
    public function hasOrders(int $areaId): bool;
}
