<?php

declare(strict_types=1);

namespace App\Repositories\Country;

use App\DTOs\Country\CountryDTO;
use App\Models\Master\Country;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CountryRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?Country;
    public function findById(int $id): ?Country;
    public function findByUuid(string $uuid): ?Country;
    public function create(CountryDTO $dto, int $createdBy): Country;
    public function update(Country $country, array $data, int $updatedBy): Country;
    public function softDelete(Country $country, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(Country $country): bool;
    public function setStatus(Country $country, string $status): Country;
    public function setDefault(Country $country): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function search(string $query): \Illuminate\Database\Eloquent\Collection;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function nameExists(string $name, ?int $excludeId = null): bool;
    public function iso2Exists(string $iso2, ?int $excludeId = null): bool;
    public function iso3Exists(string $iso3, ?int $excludeId = null): bool;
}
