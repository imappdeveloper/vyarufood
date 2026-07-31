<?php

declare(strict_types=1);

namespace App\Repositories\CustomerSubscription;

use App\Models\CustomerSubscription;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CustomerSubscriptionRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getAll(): Collection;
    public function getById(int $id): ?CustomerSubscription;
    public function getByUuid(string $uuid): ?CustomerSubscription;
    public function getByCustomer(int $customerId, array $filters = []): LengthAwarePaginator;
    public function create(array $data): CustomerSubscription;
    public function update(int $id, array $data): ?CustomerSubscription;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function forceDelete(int $id): bool;
    public function getStats(): array;
    public function getDashboardStats(): array;
    public function getPendingRenewals(): Collection;
    public function getExpiringSoon(int $days = 3): Collection;
    public function generateSubscriptionNumber(): string;
}
