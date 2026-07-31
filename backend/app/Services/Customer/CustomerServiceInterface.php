<?php

declare(strict_types=1);

namespace App\Services\Customer;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(): \Illuminate\Database\Eloquent\Collection;
    public function getActive(): \Illuminate\Database\Eloquent\Collection;
    public function findById(int $id): ?Customer;
    public function findByUuid(string $uuid): ?Customer;
    public function create(array $data): Customer;
    public function update(Customer $customer, array $data): Customer;
    public function delete(Customer $customer): bool;
    public function restore(int $id): bool;
    public function forceDelete(Customer $customer): bool;
    public function setStatus(Customer $customer, string $status): Customer;
    public function block(Customer $customer, ?string $reason = null): Customer;
    public function unblock(Customer $customer): Customer;
    public function bulkDelete(array $ids): int;
    public function bulkSetStatus(array $ids, string $status): int;
    public function import(array $rows): array;
    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection;
    public function downloadSampleTemplate(): string;
    public function countByStatus(): array;
    public function countBlocked(): int;
    public function getStats(): array;
    public function search(?string $search): \Illuminate\Database\Eloquent\Collection;
}
