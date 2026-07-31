<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\Models\Kitchen;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface KitchenServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?Kitchen;
    public function findByUuid(string $uuid): ?Kitchen;
    public function create(array $data): Kitchen;
    public function update(Kitchen $kitchen, array $data): Kitchen;
    public function delete(Kitchen $kitchen): bool;
    public function restore(int $id): bool;
    public function forceDelete(Kitchen $kitchen): bool;
    public function setDefault(Kitchen $kitchen): Kitchen;
    public function setStatus(Kitchen $kitchen, string $status): Kitchen;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): Collection;
    public function downloadSampleTemplate(): string;
    public function getStats(): array;
    public function getDefault(): ?Kitchen;
    public function search(?string $search): Collection;
    public function hasRelatedData(Kitchen $kitchen): bool;
}
