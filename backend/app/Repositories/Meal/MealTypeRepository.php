<?php

declare(strict_types=1);

namespace App\Repositories\Meal;

use App\DTOs\Meal\MealTypeDTO;
use App\Enums\StatusEnum;
use App\Models\MealType;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MealTypeRepository extends BaseRepository implements MealTypeRepositoryInterface
{
    protected function model(): MealType
    {
        return new MealType;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->search($filters['search'] ?? null);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
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

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->query()
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActive(): Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(int $id): ?MealType
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?MealType
    {
        return $this->model->where('uuid', $uuid)
            ->with(['createdBy', 'updatedBy'])
            ->first();
    }

    public function create(MealTypeDTO $dto, int $createdBy): MealType
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        if (! empty($data['is_default']) && $data['is_default']) {
            $this->unsetOtherDefaults();
        }

        return $this->model->create($data);
    }

    public function update(MealType $mealType, array $data, int $updatedBy): MealType
    {
        $data['updated_by'] = $updatedBy;

        if (isset($data['is_default']) && $data['is_default']) {
            $this->unsetOtherDefaults($mealType->id);
        }

        $mealType->update($data);

        return $mealType->fresh();
    }

    public function softDelete(MealType $mealType, int $deletedBy): bool
    {
        $mealType->deleted_by = $deletedBy;
        $mealType->save();

        return $mealType->delete();
    }

    public function restore(int $id): bool
    {
        $mealType = $this->model->withTrashed()->find($id);

        if (! $mealType) {
            return false;
        }

        return $mealType->restore();
    }

    public function forceDelete(MealType $mealType): bool
    {
        return $mealType->forceDelete();
    }

    public function setDefault(MealType $mealType): MealType
    {
        $this->unsetOtherDefaults($mealType->id);

        $mealType->is_default = true;
        $mealType->save();

        return $mealType->fresh();
    }

    public function unsetOtherDefaults(?int $excludeId = null): void
    {
        $query = $this->model->query()
            ->where('is_default', true);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $query->update(['is_default' => false]);
    }

    public function setStatus(MealType $mealType, string $status): MealType
    {
        $mealType->status = $status;
        $mealType->save();

        return $mealType->fresh();
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
                $dto = MealTypeDTO::fromArray($row);
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

    public function getForExport(?array $filters = null): Collection
    {
        $query = $this->model->query();

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('display_order', 'asc')->orderBy('created_at', 'desc')->get();
    }

    public function countByStatus(): array
    {
        return $this->model->query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function countDefault(): int
    {
        return $this->model->query()->where('is_default', true)->count();
    }

    public function getDefault(): ?MealType
    {
        return $this->model->query()
            ->where('is_default', true)
            ->where('status', StatusEnum::Active)
            ->first();
    }

    public function search(?string $search): Collection
    {
        return $this->model->query()
            ->search($search)
            ->limit(25)
            ->get();
    }

    public function hasRelatedData(MealType $mealType): bool
    {
        if (class_exists(\App\Models\Meal::class)) {
            if ($mealType->meals()->exists()) {
                return true;
            }
        }

        return false;
    }
}
