<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\Models\KitchenCapacity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface KitchenCapacityRepositoryInterface
{
    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(int $kitchenId): Collection;
    public function getById(int $id): ?KitchenCapacity;
    public function findByUuid(string $uuid): ?KitchenCapacity;
    public function create(array $data, int $createdBy): KitchenCapacity;
    public function update(KitchenCapacity $capacity, array $data, int $updatedBy): KitchenCapacity;
    public function delete(KitchenCapacity $capacity): bool;
    public function getByDate(int $kitchenId, string $date): ?KitchenCapacity;
    public function getForDateRange(int $kitchenId, string $from, string $to): Collection;
    public function getUpcoming(int $kitchenId): Collection;
}
