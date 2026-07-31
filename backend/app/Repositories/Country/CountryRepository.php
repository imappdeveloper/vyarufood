<?php

declare(strict_types=1);

namespace App\Repositories\Country;

use App\DTOs\Country\CountryDTO;
use App\Enums\StatusEnum;
use App\Models\Master\Country;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CountryRepository extends BaseRepository implements CountryRepositoryInterface
{
    protected function model(): Country
    {
        return new Country;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->search($filters['search'] ?? null);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['region'])) {
            $query->where('region', $filters['region']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()->orderBy('sort_order', 'asc')->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getDefault(): ?Country
    {
        return $this->model->query()->where('is_default', true)->first();
    }

    public function findById(int $id): ?Country
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Country
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function create(CountryDTO $dto, int $createdBy): Country
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(Country $country, array $data, int $updatedBy): Country
    {
        $data['updated_by'] = $updatedBy;
        $country->update($data);

        return $country->fresh();
    }

    public function softDelete(Country $country, int $deletedBy): bool
    {
        $country->deleted_by = $deletedBy;
        $country->save();

        return $country->delete();
    }

    public function restore(int $id): bool
    {
        $country = $this->model->withTrashed()->find($id);

        if (!$country) {
            return false;
        }

        return $country->restore();
    }

    public function forceDelete(Country $country): bool
    {
        return $country->forceDelete();
    }

    public function setStatus(Country $country, string $status): Country
    {
        $country->status = $status;
        $country->save();

        return $country->fresh();
    }

    public function setDefault(Country $country): bool
    {
        $this->model->query()->where('is_default', true)->update(['is_default' => false]);

        $country->is_default = true;
        $country->save();

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
                $dto = CountryDTO::fromArray($row);
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
        $query = $this->model->query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['region'])) {
            $query->where('region', $filters['region']);
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

    public function nameExists(string $name, ?int $excludeId = null): bool
    {
        $query = $this->model->where('name', $name);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function iso2Exists(string $iso2, ?int $excludeId = null): bool
    {
        $query = $this->model->where('iso2', strtoupper($iso2));

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function iso3Exists(string $iso3, ?int $excludeId = null): bool
    {
        $query = $this->model->where('iso3', strtoupper($iso3));

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
