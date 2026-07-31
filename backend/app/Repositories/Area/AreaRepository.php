<?php

declare(strict_types=1);

namespace App\Repositories\Area;

use App\DTOs\Area\AreaDTO;
use App\Enums\StatusEnum;
use App\Models\Master\Area;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AreaRepository extends BaseRepository implements AreaRepositoryInterface
{
    protected function model(): Area
    {
        return new Area;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['country', 'state', 'city'])
            ->search($filters['search'] ?? null);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (! empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }

        if (! empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (isset($filters['is_serviceable']) && $filters['is_serviceable'] !== '') {
            $query->where('is_serviceable', filter_var($filters['is_serviceable'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_default']) && $filters['is_default'] !== '') {
            $query->where('is_default', filter_var($filters['is_default'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        $sortColumn = match ($sort) {
            'sort_order' => 'display_order',
            default => $sort,
        };

        return $query->orderBy($sortColumn, $order)->paginate($perPage);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()->with(['country', 'state', 'city'])->orderBy('display_order', 'asc')->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getDefault(): ?Area
    {
        return $this->model->query()->where('is_default', true)->first();
    }

    public function findById(int $id): ?Area
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Area
    {
        return $this->model->where('uuid', $uuid)->with(['country', 'state', 'city'])->first();
    }

    public function create(AreaDTO $dto, int $createdBy): Area
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(Area $area, array $data, int $updatedBy): Area
    {
        if (isset($data['sort_order']) && ! isset($data['display_order'])) {
            $data['display_order'] = $data['sort_order'];
            unset($data['sort_order']);
        }
        $data['updated_by'] = $updatedBy;
        $area->update($data);

        return $area->fresh();
    }

    public function softDelete(Area $area, int $deletedBy): bool
    {
        $area->deleted_by = $deletedBy;
        $area->save();

        return $area->delete();
    }

    public function restore(int $id): bool
    {
        $area = $this->model->withTrashed()->find($id);

        if (! $area) {
            return false;
        }

        return $area->restore();
    }

    public function forceDelete(Area $area): bool
    {
        return $area->forceDelete();
    }

    public function setStatus(Area $area, string $status): Area
    {
        $area->status = $status;
        $area->save();

        return $area->fresh();
    }

    public function setServiceable(Area $area, bool $isServiceable): Area
    {
        $area->is_serviceable = $isServiceable;
        $area->save();

        return $area->fresh();
    }

    public function setDefault(Area $area): bool
    {
        $this->model->query()
            ->where('city_id', $area->city_id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        $area->is_default = true;
        $area->save();

        return true;
    }

    public function bulkDelete(array $ids): int
    {
        return $this->model->whereIn('id', $ids)->delete();
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        return $this->model->whereIn('id', $ids)->update(['status' => $status]);
    }

    public function import(array $rows): array
    {
        $successes = 0;
        $failures = [];
        $createdBy = auth()->guard('admin')->id();

        foreach ($rows as $index => $row) {
            try {
                $dto = AreaDTO::fromArray($row);
                $this->create($dto, $createdBy);
                $successes++;
            } catch (\Exception $e) {
                $failures[] = [
                    'row' => $index + 1,
                    'error' => $e->getMessage(),
                    'data' => $row,
                ];
            }
        }

        return [
            'successes' => $successes,
            'failures' => $failures,
            'total' => count($rows),
        ];
    }

    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = $this->model->query()->with(['country', 'state', 'city']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (! empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }

        if (! empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('name', 'asc')->get();
    }

    public function countByStatus(): array
    {
        return $this->model->query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getActiveByCity(int $cityId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('city_id', $cityId)
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function hasCustomers(int $areaId): bool
    {
        return false;
    }

    public function hasOrders(int $areaId): bool
    {
        return false;
    }
}
