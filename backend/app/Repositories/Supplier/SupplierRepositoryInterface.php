<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SupplierRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?Supplier;
    public function getByUuid(string $uuid): ?Supplier;
    public function create(array $data): Supplier;
    public function update(int $id, array $data): ?Supplier;
    public function delete(int $id): bool;
    public function generateSupplierCode(): string;
    public function countByStatus(): array;
    public function getPreferred(): Collection;
    public function getExpiringDocuments(int $days): Collection;
}
