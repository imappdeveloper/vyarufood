<?php

declare(strict_types=1);

namespace App\Repositories\CustomerAddress;

use App\DTOs\CustomerAddress\CustomerAddressDTO;
use App\Models\CustomerAddress;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CustomerAddressRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?CustomerAddress;
    public function findByUuid(string $uuid): ?CustomerAddress;
    public function create(CustomerAddressDTO $dto, int $createdBy): CustomerAddress;
    public function update(CustomerAddress $address, array $data, int $updatedBy): CustomerAddress;
    public function softDelete(CustomerAddress $address, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(CustomerAddress $address): bool;
    public function setDefault(CustomerAddress $address): CustomerAddress;
    public function unsetOtherDefaults(int $customerId, ?int $excludeId = null): void;
    public function verify(CustomerAddress $address, int $verifiedBy): CustomerAddress;
    public function setStatus(CustomerAddress $address, string $status): CustomerAddress;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): Collection;
    public function getDefaultForCustomer(int $customerId): ?CustomerAddress;
    public function countByCustomer(int $customerId): int;
    public function countByStatus(): array;
    public function countVerified(): int;
    public function search(?string $search): Collection;
    public function checkServiceAvailability(array $data): array;
}
