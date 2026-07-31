<?php

declare(strict_types=1);

namespace App\Services\City;

use App\Models\Master\City;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CityServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?City;
    public function findById(int $id): ?City;
    public function findByUuid(string $uuid): ?City;
    public function create(array $data): City;
    public function update(City $city, array $data): City;
    public function delete(City $city): bool;
    public function restore(int $id): bool;
    public function forceDelete(City $city): bool;
    public function setStatus(City $city, string $status): City;
    public function setDefault(City $city): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function downloadSampleTemplate(): string;
    public function countByStatus(): array;
    public function getActiveByCountry(int $countryId): \Illuminate\Database\Eloquent\Collection;
    public function getActiveByState(int $stateId): \Illuminate\Database\Eloquent\Collection;
}
