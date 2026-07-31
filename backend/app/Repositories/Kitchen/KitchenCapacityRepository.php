<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\Models\KitchenCapacity;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenCapacityRepository extends BaseRepository implements KitchenCapacityRepositoryInterface
{
    protected function model(): KitchenCapacity
    {
        return new KitchenCapacity;
    }

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()->where('kitchen_id', $kitchenId)->with(['kitchen']);

        if (! empty($filters['capacity_date'])) {
            $query->where('capacity_date', $filters['capacity_date']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('capacity_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('capacity_date', '<=', $filters['date_to']);
        }

        return $query->orderBy($sort, $order)->paginate(min($perPage, 100));
    }

    public function getAll(int $kitchenId): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->with(['kitchen'])
            ->orderBy('capacity_date', 'desc')
            ->get();
    }

    public function getById(int $id): ?KitchenCapacity
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?KitchenCapacity
    {
        return $this->model->where('uuid', $uuid)->with(['kitchen'])->first();
    }

    public function create(array $data, int $createdBy): KitchenCapacity
    {
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(KitchenCapacity $capacity, array $data, int $updatedBy): KitchenCapacity
    {
        $data['updated_by'] = $updatedBy;
        $capacity->update($data);

        return $capacity->fresh();
    }

    public function delete(KitchenCapacity $capacity): bool
    {
        return (bool) $capacity->delete();
    }

    public function getByDate(int $kitchenId, string $date): ?KitchenCapacity
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('capacity_date', $date)
            ->with(['kitchen'])
            ->first();
    }

    public function getForDateRange(int $kitchenId, string $from, string $to): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('capacity_date', '>=', $from)
            ->where('capacity_date', '<=', $to)
            ->with(['kitchen'])
            ->orderBy('capacity_date')
            ->get();
    }

    public function getUpcoming(int $kitchenId): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('capacity_date', '>=', now()->toDateString())
            ->with(['kitchen'])
            ->orderBy('capacity_date')
            ->get();
    }
}
