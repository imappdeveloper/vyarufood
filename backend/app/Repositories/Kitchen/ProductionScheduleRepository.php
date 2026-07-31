<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\Models\ProductionSchedule;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductionScheduleRepository extends BaseRepository implements ProductionScheduleRepositoryInterface
{
    protected function model(): ProductionSchedule
    {
        return new ProductionSchedule;
    }

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()->where('kitchen_id', $kitchenId)->with(['kitchen']);

        if (! empty($filters['production_date'])) {
            $query->where('production_date', $filters['production_date']);
        }

        if (! empty($filters['meal_type'])) {
            $query->where('meal_type', $filters['meal_type']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('production_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('production_date', '<=', $filters['date_to']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy($sort, $order)->paginate(min($perPage, 100));
    }

    public function getAll(int $kitchenId): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->with(['kitchen'])
            ->orderBy('production_date', 'desc')
            ->get();
    }

    public function getById(int $id): ?ProductionSchedule
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?ProductionSchedule
    {
        return $this->model->where('uuid', $uuid)->with(['kitchen'])->first();
    }

    public function create(array $data, int $createdBy): ProductionSchedule
    {
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(ProductionSchedule $schedule, array $data, int $updatedBy): ProductionSchedule
    {
        $data['updated_by'] = $updatedBy;
        $schedule->update($data);

        return $schedule->fresh();
    }

    public function delete(ProductionSchedule $schedule): bool
    {
        return (bool) $schedule->delete();
    }

    public function getByDate(int $kitchenId, string $date): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('production_date', $date)
            ->with(['kitchen'])
            ->orderBy('meal_type')
            ->get();
    }

    public function getForDateRange(int $kitchenId, string $from, string $to): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('production_date', '>=', $from)
            ->where('production_date', '<=', $to)
            ->with(['kitchen'])
            ->orderBy('production_date')
            ->orderBy('meal_type')
            ->get();
    }

    public function getUpcoming(int $kitchenId): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('production_date', '>=', now()->toDateString())
            ->with(['kitchen'])
            ->orderBy('production_date')
            ->orderBy('meal_type')
            ->get();
    }
}
