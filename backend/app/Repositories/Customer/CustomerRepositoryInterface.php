<?php

declare(strict_types=1);

namespace App\Repositories\Customer;

use App\DTOs\Customer\CustomerDTO;
use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function findById(int $id): ?Customer;
    public function findByUuid(string $uuid): ?Customer;
    public function findByEmail(string $email): ?Customer;
    public function findByPhone(string $phone): ?Customer;
    public function findByReferralCode(string $referralCode): ?Customer;
    public function create(CustomerDTO $dto, int $createdBy): Customer;
    public function update(Customer $customer, array $data, int $updatedBy): Customer;
    public function softDelete(Customer $customer, int $deletedBy): bool;
    public function restore(int $id): bool;
    public function forceDelete(Customer $customer): bool;
    public function setStatus(Customer $customer, string $status): Customer;
    public function block(Customer $customer, ?string $reason = null): Customer;
    public function unblock(Customer $customer): Customer;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function countByStatus(): array;
    public function countBlocked(): int;
    public function hasOrders(int $customerId): bool;
    public function search(?string $search): \Illuminate\Database\Eloquent\Collection;
}
