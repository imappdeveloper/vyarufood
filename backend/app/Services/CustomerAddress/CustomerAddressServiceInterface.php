<?php

declare(strict_types=1);

namespace App\Services\CustomerAddress;

use App\Models\CustomerAddress;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CustomerAddressServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getActive(): Collection;
    public function getById(int $id): ?CustomerAddress;
    public function findByUuid(string $uuid): ?CustomerAddress;
    public function create(array $data): CustomerAddress;
    public function update(CustomerAddress $address, array $data): CustomerAddress;
    public function delete(CustomerAddress $address): bool;
    public function restore(int $id): bool;
    public function forceDelete(CustomerAddress $address): bool;
    public function setDefault(CustomerAddress $address): CustomerAddress;
    public function verify(CustomerAddress $address): CustomerAddress;
    public function setStatus(CustomerAddress $address, string $status): CustomerAddress;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): Collection;
    public function downloadSampleTemplate(): string;
    public function getStats(): array;
    public function getDefaultForCustomer(int $customerId): ?CustomerAddress;
    public function checkServiceAvailability(array $data): array;
    public function search(?string $search): Collection;
}
