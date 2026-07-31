<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\Models\KitchenWorkingDay;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface KitchenWorkingDayServiceInterface
{
    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(int $kitchenId): Collection;
    public function getById(int $id): ?KitchenWorkingDay;
    public function findByUuid(string $uuid): ?KitchenWorkingDay;
    public function create(array $data): KitchenWorkingDay;
    public function update(KitchenWorkingDay $workingDay, array $data): KitchenWorkingDay;
    public function delete(KitchenWorkingDay $workingDay): bool;
    public function bulkUpdate(int $kitchenId, array $days): int;
    public function getWorkingDays(int $kitchenId): Collection;
    public function getDefaultSchedule(): array;
}
