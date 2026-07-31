<?php

declare(strict_types=1);

namespace App\Services\Area;

use App\Models\Master\Area;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AreaServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?Area;
    public function findById(int $id): ?Area;
    public function findByUuid(string $uuid): ?Area;
    public function create(array $data): Area;
    public function update(Area $area, array $data): Area;
    public function delete(Area $area): bool;
    public function restore(int $id): bool;
    public function forceDelete(Area $area): bool;
    public function setStatus(Area $area, string $status): Area;
    public function setServiceable(Area $area, bool $isServiceable): Area;
    public function setDefault(Area $area): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function downloadSampleTemplate(): string;
    public function countByStatus(): array;
    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection;
}
