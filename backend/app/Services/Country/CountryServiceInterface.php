<?php

declare(strict_types=1);

namespace App\Services\Country;

use App\DTOs\Country\CountryDTO;
use App\Models\Master\Country;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CountryServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?Country;
    public function findById(int $id): ?Country;
    public function findByUuid(string $uuid): ?Country;
    public function create(array $data): Country;
    public function update(Country $country, array $data): Country;
    public function delete(Country $country): bool;
    public function restore(int $id): bool;
    public function forceDelete(Country $country): bool;
    public function setStatus(Country $country, string $status): Country;
    public function setDefault(Country $country): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function downloadSampleTemplate(): string;
    public function countByStatus(): array;
}
