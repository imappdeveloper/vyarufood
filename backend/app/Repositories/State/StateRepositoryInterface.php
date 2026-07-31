<?php

declare(strict_types=1);

namespace App\Repositories\State;

use App\DTOs\State\StateDTO;
use App\Models\Master\State;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StateRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?State;
    public function findById(int $id): ?State;
    public function findByUuid(string $uuid): ?State;
    public function create(StateDTO $dto, int $createdBy): State;
    public function update(State $state, array $data, int $updatedBy): State;
    public function softDelete(State $state, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(State $state): bool;
    public function setStatus(State $state, string $status): State;
    public function setDefault(State $state): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function search(string $query): \Illuminate\Database\Eloquent\Collection;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function nameExists(string $name, int $countryId, ?int $excludeId = null): bool;
    public function stateCodeExists(string $stateCode, int $countryId, ?int $excludeId = null): bool;
}
