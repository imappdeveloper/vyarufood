<?php

declare(strict_types=1);

namespace App\Repositories\City;

use App\DTOs\City\CityDTO;
use App\Enums\StatusEnum;
use App\Models\Master\City;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CityRepository extends BaseRepository implements CityRepositoryInterface
{
    protected function model(): City
    {
        return new City;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['country', 'state'])
            ->search($filters['search'] ?? null);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (!empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }

        if (isset($filters['is_metro']) && $filters['is_metro'] !== '') {
            $query->where('is_metro', filter_var($filters['is_metro'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_default']) && $filters['is_default'] !== '') {
            $query->where('is_default', filter_var($filters['is_default'], FILTER_VALIDATE_BOOLEAN));
        }

        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()->with(['country', 'state'])->orderBy('display_order', 'asc')->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getDefault(): ?City
    {
        return $this->model->query()->where('is_default', true)->first();
    }

    public function findById(int $id): ?City
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?City
    {
        return $this->model->where('uuid', $uuid)->with(['country', 'state'])->first();
    }

    public function create(CityDTO $dto, int $createdBy): City
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(City $city, array $data, int $updatedBy): City
    {
        if (isset($data['sort_order']) && ! isset($data['display_order'])) {
            $data['display_order'] = $data['sort_order'];
            unset($data['sort_order']);
        }
        $data['updated_by'] = $updatedBy;
        $city->update($data);

        return $city->fresh();
    }

    public function softDelete(City $city, int $deletedBy): bool
    {
        $city->deleted_by = $deletedBy;
        $city->save();

        return $city->delete();
    }

    public function restore(int $id): bool
    {
        $city = $this->model->withTrashed()->find($id);

        if (!$city) {
            return false;
        }

        return $city->restore();
    }

    public function forceDelete(City $city): bool
    {
        return $city->forceDelete();
    }

    public function setStatus(City $city, string $status): City
    {
        $city->status = $status;
        $city->save();

        return $city->fresh();
    }

    public function setDefault(City $city): bool
    {
        $this->model->query()
            ->where('state_id', $city->state_id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        $city->is_default = true;
        $city->save();

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

    public function search(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()->search($query)->orderBy('name', 'asc')->get();
    }

    public function import(array $rows): array
    {
        $successes = 0;
        $failures = [];
        $createdBy = auth()->guard('admin')->id();

        foreach ($rows as $index => $row) {
            try {
                $dto = CityDTO::fromArray($row);
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
        $query = $this->model->query()->with(['country', 'state']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (!empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }

        if (!empty($filters['search'])) {
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

    public function nameExists(string $name, int $stateId, ?int $excludeId = null): bool
    {
        $query = $this->model->where('name', $name)->where('state_id', $stateId);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function cityCodeExists(string $cityCode, ?int $excludeId = null): bool
    {
        $query = $this->model->where('city_code', $cityCode);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function getActiveByCountry(int $countryId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('country_id', $countryId)
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getActiveByState(int $stateId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('state_id', $stateId)
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }
}
