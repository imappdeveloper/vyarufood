<?php

declare(strict_types=1);

namespace App\Repositories\Order;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface OrderRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getById(int $id): ?Order;
    public function getByUuid(string $uuid): ?Order;
    public function create(array $data): Order;
    public function update(int $id, array $data): ?Order;
    public function delete(int $id): bool;
    public function restore(int $id): bool;
    public function forceDelete(int $id): bool;
    public function getStats(): array;
    public function getDashboardStats(): array;
    public function getTodayOrders(int $kitchenId = null): Collection;
    public function generateOrderNumber(): string;
}
