<?php

declare(strict_types=1);

namespace App\Services\State;

use App\Models\Master\State;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StateServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function getDefault(): ?State;
    public function findById(int $id): ?State;
    public function findByUuid(string $uuid): ?State;
    public function create(array $data): State;
    public function update(State $state, array $data): State;
    public function delete(State $state): bool;
    public function restore(int $id): bool;
    public function forceDelete(State $state): bool;
    public function setStatus(State $state, string $status): State;
    public function setDefault(State $state): bool;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function downloadSampleTemplate(): string;
    public function countByStatus(): array;
}
