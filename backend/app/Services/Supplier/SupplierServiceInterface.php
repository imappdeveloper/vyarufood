<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierDTO;
use App\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SupplierServiceInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?Supplier;
    public function getByUuid(string $uuid): ?Supplier;
    public function create(SupplierDTO $dto): Supplier;
    public function update(int $id, SupplierDTO $dto): ?Supplier;
    public function delete(int $id): bool;
    public function changeStatus(int $id, string $status): ?Supplier;
    public function blacklist(int $id, ?string $reason = null): ?Supplier;
    public function restore(int $id): ?Supplier;
    public function getStats(): array;
    public function getPreferred(): Collection;
    public function getExpiringDocuments(int $days): Collection;
    public function getDashboardStats(): array;
}
