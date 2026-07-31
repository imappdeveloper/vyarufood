<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\Enums\StatusEnum;
use App\Models\KitchenHoliday;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenHolidayRepository extends BaseRepository implements KitchenHolidayRepositoryInterface
{
    protected function model(): KitchenHoliday
    {
        return new KitchenHoliday;
    }

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()->where('kitchen_id', $kitchenId)->with(['kitchen']);

        if (! empty($filters['holiday_type'])) {
            $query->where('holiday_type', $filters['holiday_type']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('start_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('end_date', '<=', $filters['date_to']);
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
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function getById(int $id): ?KitchenHoliday
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?KitchenHoliday
    {
        return $this->model->where('uuid', $uuid)->with(['kitchen'])->first();
    }

    public function create(array $data, int $createdBy): KitchenHoliday
    {
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(KitchenHoliday $holiday, array $data, int $updatedBy): KitchenHoliday
    {
        $data['updated_by'] = $updatedBy;
        $holiday->update($data);

        return $holiday->fresh();
    }

    public function delete(KitchenHoliday $holiday): bool
    {
        return (bool) $holiday->delete();
    }

    public function isDateOverlapping(int $kitchenId, string $startDate, string $endDate, ?int $excludeId = null): bool
    {
        $query = $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('start_date', '<=', $endDate)
            ->where('end_date', '>=', $startDate);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function getActiveHolidaysForDate(int $kitchenId, string $date): Collection
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('status', StatusEnum::Active)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->get();
    }

    public function isKitchenOnHoliday(int $kitchenId, string $date): bool
    {
        return $this->model->query()
            ->where('kitchen_id', $kitchenId)
            ->where('status', StatusEnum::Active)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();
    }
}
