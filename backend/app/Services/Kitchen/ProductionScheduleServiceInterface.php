<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\Models\ProductionSchedule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductionScheduleServiceInterface
{
    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;
    public function getAll(int $kitchenId): Collection;
    public function getById(int $id): ?ProductionSchedule;
    public function findByUuid(string $uuid): ?ProductionSchedule;
    public function create(array $data): ProductionSchedule;
    public function update(ProductionSchedule $schedule, array $data): ProductionSchedule;
    public function delete(ProductionSchedule $schedule): bool;
    public function getByDate(int $kitchenId, string $date): Collection;
    public function getForDateRange(int $kitchenId, string $from, string $to): Collection;
    public function getUpcoming(int $kitchenId): Collection;
    public function bulkUpdateStatus(int $kitchenId, array $scheduleIds, string $status): int;
    public function generateDailyPlan(int $kitchenId, string $date, array $mealTypes): int;
    public function markCompleted(ProductionSchedule $schedule): ProductionSchedule;
    public function getProductionStats(int $kitchenId): array;
}
