<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\Models\KitchenWorkingDay;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenWorkingDayRepository extends BaseRepository implements KitchenWorkingDayRepositoryInterface
{
    protected function model(): KitchenWorkingDay
    {
        return new KitchenWorkingDay;
    }

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()->where('kitchen_id', $kitchenId)->with(['kitchen']);

        if (! empty($filters['day_of_week'])) {
            $query->where('day_of_week', $filters['day_of_week']);
        }

        if (isset($filters['is_working']) && $filters['is_working'] !== '') {
            $query->where('is_working', filter_var($filters['is_working'], FILTER_VALIDATE_BOOLEAN));
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
            ->orderBy('day_of_week')
            ->get();
    }

    public function getById(int $id): ?KitchenWorkingDay
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?KitchenWorkingDay
    {
        return $this->model->where('uuid', $uuid)->with(['kitchen'])->first();
    }

    public function create(array $data, int $createdBy): KitchenWorkingDay
    {
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(KitchenWorkingDay $workingDay, array $data, int $updatedBy): KitchenWorkingDay
    {
        $data['updated_by'] = $updatedBy;
        $workingDay->update($data);

        return $workingDay->fresh();
    }

    public function delete(KitchenWorkingDay $workingDay): bool
    {
        return (bool) $workingDay->delete();
    }

    public function bulkUpdate(int $kitchenId, array $days, int $updatedBy): int
    {
        $count = 0;

        foreach ($days as $day) {
            $existing = $this->model->where('kitchen_id', $kitchenId)
                ->where('day_of_week', $day['day_of_week'])
                ->first();

            if ($existing) {
                $existing->update(array_merge($day, ['updated_by' => $updatedBy]));
            } else {
                $day['kitchen_id'] = $kitchenId;
                $day['created_by'] = $updatedBy;
                $day['updated_by'] = $updatedBy;
                $this->model->create($day);
            }

            $count++;
        }

        return $count;
    }

    public function getWorkingDays(int $kitchenId): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('is_working', true)
            ->orderBy('day_of_week')
            ->get();
    }
}
