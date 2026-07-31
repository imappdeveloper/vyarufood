<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\DTOs\Kitchen\ProductionScheduleDTO;
use App\Models\ProductionSchedule;
use App\Repositories\Kitchen\ProductionScheduleRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductionScheduleService extends BaseService implements ProductionScheduleServiceInterface
{
    protected string $moduleName = 'production_schedule';

    public function __construct(
        protected ProductionScheduleRepositoryInterface $repo,
    ) {}

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->repo->getPaginated($kitchenId, $filters, $perPage, $sort, $order);
    }

    public function getAll(int $kitchenId): Collection
    {
        $cacheKey = CacheManager::cacheKey('production_schedule', "all:{$kitchenId}");

        return CacheManager::remember($cacheKey, 3600, fn () => $this->repo->getAll($kitchenId));
    }

    public function getById(int $id): ?ProductionSchedule
    {
        return $this->repo->getById($id);
    }

    public function findByUuid(string $uuid): ?ProductionSchedule
    {
        return $this->repo->findByUuid($uuid);
    }

    public function create(array $data): ProductionSchedule
    {
        return $this->transaction(function () use ($data) {
            if (empty($data['remaining_quantity'])) {
                $data['remaining_quantity'] = ($data['planned_quantity'] ?? 0) - ($data['produced_quantity'] ?? 0);
            }

            $dto = ProductionScheduleDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $schedule = $this->repo->create($dto->toArray(), $createdBy);

            CacheManager::flush('production_schedule');

            $this->logInfo('Production schedule created', ['id' => $schedule->id]);
            $this->logActivity('production_planned', $schedule);

            return $schedule;
        });
    }

    public function update(ProductionSchedule $schedule, array $data): ProductionSchedule
    {
        return $this->transaction(function () use ($schedule, $data) {
            if (isset($data['planned_quantity']) || isset($data['produced_quantity'])) {
                $planned = $data['planned_quantity'] ?? $schedule->planned_quantity;
                $produced = $data['produced_quantity'] ?? $schedule->produced_quantity;
                $data['remaining_quantity'] = max(0, $planned - $produced);
            }

            $updatedBy = auth()->guard('admin')->id();
            $schedule = $this->repo->update($schedule, $data, $updatedBy);

            CacheManager::flush('production_schedule');

            $this->logInfo('Production schedule updated', ['id' => $schedule->id]);
            $this->logActivity('production_updated', $schedule);

            return $schedule;
        });
    }

    public function delete(ProductionSchedule $schedule): bool
    {
        $result = $this->repo->delete($schedule);

        if ($result) {
            CacheManager::flush('production_schedule');
            $this->logInfo('Production schedule deleted', ['id' => $schedule->id]);
            $this->logActivity('production_deleted', $schedule);
        }

        return $result;
    }

    public function getByDate(int $kitchenId, string $date): Collection
    {
        return $this->repo->getByDate($kitchenId, $date);
    }

    public function getForDateRange(int $kitchenId, string $from, string $to): Collection
    {
        return $this->repo->getForDateRange($kitchenId, $from, $to);
    }

    public function getUpcoming(int $kitchenId): Collection
    {
        return $this->repo->getUpcoming($kitchenId);
    }

    public function bulkUpdateStatus(int $kitchenId, array $scheduleIds, string $status): int
    {
        $count = 0;
        $updatedBy = auth()->guard('admin')->id();

        foreach ($scheduleIds as $id) {
            $schedule = $this->repo->getById($id);
            if ($schedule && $schedule->kitchen_id === $kitchenId) {
                $this->repo->update($schedule, ['status' => $status], $updatedBy);
                $count++;
            }
        }

        if ($count > 0) {
            CacheManager::flush('production_schedule');
            $this->logInfo('Bulk production status updated', ['kitchen_id' => $kitchenId, 'count' => $count, 'status' => $status]);
        }

        return $count;
    }

    public function generateDailyPlan(int $kitchenId, string $date, array $mealTypes): int
    {
        $count = 0;
        $createdBy = auth()->guard('admin')->id();

        foreach ($mealTypes as $mealType) {
            $existing = $this->repo->getByDate($kitchenId, $date)
                ->where('meal_type', $mealType)
                ->first();

            if (! $existing) {
                $this->repo->create([
                    'kitchen_id' => $kitchenId,
                    'production_date' => $date,
                    'meal_type' => $mealType,
                    'planned_quantity' => 0,
                    'produced_quantity' => 0,
                    'remaining_quantity' => 0,
                    'status' => 'planned',
                ], $createdBy);
                $count++;
            }
        }

        if ($count > 0) {
            CacheManager::flush('production_schedule');
            $this->logInfo('Daily production plan generated', ['kitchen_id' => $kitchenId, 'date' => $date, 'count' => $count]);
        }

        return $count;
    }

    public function markCompleted(ProductionSchedule $schedule): ProductionSchedule
    {
        return $this->transaction(function () use ($schedule) {
            $data = [
                'produced_quantity' => $schedule->planned_quantity,
                'remaining_quantity' => 0,
                'status' => 'completed',
                'production_end' => now()->toDateTimeString(),
            ];

            $updatedBy = auth()->guard('admin')->id();
            $schedule = $this->repo->update($schedule, $data, $updatedBy);

            CacheManager::flush('production_schedule');

            $this->logInfo('Production completed', ['id' => $schedule->id]);
            $this->logActivity('production_completed', $schedule);

            return $schedule;
        });
    }

    public function getProductionStats(int $kitchenId): array
    {
        $cacheKey = CacheManager::cacheKey('production_schedule', "stats:{$kitchenId}");

        return CacheManager::remember($cacheKey, 300, function () use ($kitchenId) {
            $upcoming = $this->repo->getUpcoming($kitchenId);

            return [
                'total_schedules' => $upcoming->count(),
                'planned' => $upcoming->where('status', 'planned')->count(),
                'in_progress' => $upcoming->where('status', 'in_progress')->count(),
                'completed' => $upcoming->where('status', 'completed')->count(),
                'cancelled' => $upcoming->where('status', 'cancelled')->count(),
                'total_planned' => $upcoming->sum('planned_quantity'),
                'total_produced' => $upcoming->sum('produced_quantity'),
                'completion_rate' => $upcoming->sum('planned_quantity') > 0
                    ? round(($upcoming->sum('produced_quantity') / $upcoming->sum('planned_quantity')) * 100, 1)
                    : 0,
            ];
        });
    }
}
