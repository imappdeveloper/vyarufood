<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\Models\KitchenHoliday;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface KitchenHolidayRepositoryInterface
{
    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(int $kitchenId): Collection;
    public function getById(int $id): ?KitchenHoliday;
    public function findByUuid(string $uuid): ?KitchenHoliday;
    public function create(array $data, int $createdBy): KitchenHoliday;
    public function update(KitchenHoliday $holiday, array $data, int $updatedBy): KitchenHoliday;
    public function delete(KitchenHoliday $holiday): bool;
    public function isDateOverlapping(int $kitchenId, string $startDate, string $endDate, ?int $excludeId = null): bool;
    public function getActiveHolidaysForDate(int $kitchenId, string $date): Collection;
    public function isKitchenOnHoliday(int $kitchenId, string $date): bool;
}
