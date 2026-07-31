<?php

declare(strict_types=1);

namespace App\Repositories\City;

use App\DTOs\City\CityDTO;
use App\Models\Master\City;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CityRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?City;
    public function findById(int $id): ?City;
    public function findByUuid(string $uuid): ?City;
    public function create(CityDTO $dto, int $createdBy): City;
    public function update(City $city, array $data, int $updatedBy): City;
    public function softDelete(City $city, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(City $city): bool;
    public function setStatus(City $city, string $status): City;
    public function setDefault(City $city): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function search(string $query): \Illuminate\Database\Eloquent\Collection;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function nameExists(string $name, int $stateId, ?int $excludeId = null): bool;
    public function cityCodeExists(string $cityCode, ?int $excludeId = null): bool;
    public function getActiveByCountry(int $countryId): \Illuminate\Database\Eloquent\Collection;
    public function getActiveByState(int $stateId): \Illuminate\Database\Eloquent\Collection;
}
