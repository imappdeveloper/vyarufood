<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\Models\KitchenCapacity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface KitchenCapacityServiceInterface
{
    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(int $kitchenId): Collection;
    public function getById(int $id): ?KitchenCapacity;
    public function findByUuid(string $uuid): ?KitchenCapacity;
    public function create(array $data): KitchenCapacity;
    public function update(KitchenCapacity $capacity, array $data): KitchenCapacity;
    public function delete(KitchenCapacity $capacity): bool;
    public function getByDate(int $kitchenId, string $date): ?KitchenCapacity;
    public function getForDateRange(int $kitchenId, string $startDate, string $endDate): Collection;
    public function getUpcoming(int $kitchenId): Collection;
    public function bulkUpdateCapacity(int $kitchenId, array $capacities): int;
    public function calculateAvailableOrders(int $kitchenId, string $date): int;
    public function getCapacityStats(int $kitchenId): array;
}
