<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\DTOs\Kitchen\KitchenDTO;
use App\Models\Kitchen;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface KitchenRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?Kitchen;
    public function findByUuid(string $uuid): ?Kitchen;
    public function create(KitchenDTO $dto, int $createdBy): Kitchen;
    public function update(Kitchen $kitchen, array $data, int $updatedBy): Kitchen;
    public function softDelete(Kitchen $kitchen, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(Kitchen $kitchen): bool;
    public function setDefault(Kitchen $kitchen): Kitchen;
    public function unsetOtherDefaults(?int $excludeId = null): void;
    public function setStatus(Kitchen $kitchen, string $status): Kitchen;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): Collection;
    public function countByStatus(): array;
    public function countDefault(): int;
    public function getDefault(): ?Kitchen;
    public function search(?string $search): Collection;
    public function hasRelatedData(Kitchen $kitchen): bool;
}
