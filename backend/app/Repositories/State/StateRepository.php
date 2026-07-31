<?php

declare(strict_types=1);

namespace App\Repositories\State;

use App\DTOs\State\StateDTO;
use App\Enums\StatusEnum;
use App\Models\Master\State;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StateRepository extends BaseRepository implements StateRepositoryInterface
{
    protected function model(): State
    {
        return new State;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with('country')
            ->search($filters['search'] ?? null);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()->with('country')->orderBy('sort_order', 'asc')->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getDefault(): ?State
    {
        return $this->model->query()->where('is_default', true)->first();
    }

    public function findById(int $id): ?State
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?State
    {
        return $this->model->where('uuid', $uuid)->with('country')->first();
    }

    public function create(StateDTO $dto, int $createdBy): State
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(State $state, array $data, int $updatedBy): State
    {
        $data['updated_by'] = $updatedBy;
        $state->update($data);

        return $state->fresh();
    }

    public function softDelete(State $state, int $deletedBy): bool
    {
        $state->deleted_by = $deletedBy;
        $state->save();

        return $state->delete();
    }

    public function restore(int $id): bool
    {
        $state = $this->model->withTrashed()->find($id);

        if (!$state) {
            return false;
        }

        return $state->restore();
    }

    public function forceDelete(State $state): bool
    {
        return $state->forceDelete();
    }

    public function setStatus(State $state, string $status): State
    {
        $state->status = $status;
        $state->save();

        return $state->fresh();
    }

    public function setDefault(State $state): bool
    {
        $this->model->query()
            ->where('country_id', $state->country_id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        $state->is_default = true;
        $state->save();

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
                $dto = StateDTO::fromArray($row);
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
        $query = $this->model->query()->with('country');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
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

    public function nameExists(string $name, int $countryId, ?int $excludeId = null): bool
    {
        $query = $this->model->where('name', $name)->where('country_id', $countryId);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function stateCodeExists(string $stateCode, int $countryId, ?int $excludeId = null): bool
    {
        $query = $this->model->where('state_code', $stateCode)->where('country_id', $countryId);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
