<?php

declare(strict_types=1);

namespace App\Repositories\Kitchen;

use App\DTOs\Kitchen\KitchenDTO;
use App\Enums\StatusEnum;
use App\Models\Kitchen;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenRepository extends BaseRepository implements KitchenRepositoryInterface
{
    protected function model(): Kitchen
    {
        return new Kitchen;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['country', 'state', 'city', 'area', 'deliveryZone'])
            ->search($filters['search'] ?? null);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['kitchen_type'])) {
            $query->where('kitchen_type', $filters['kitchen_type']);
        }

        if (isset($filters['is_default']) && $filters['is_default'] !== '') {
            $query->where('is_default', filter_var($filters['is_default'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (! empty($filters['area_id'])) {
            $query->where('area_id', $filters['area_id']);
        }

        if (! empty($filters['delivery_zone_id'])) {
            $query->where('delivery_zone_id', $filters['delivery_zone_id']);
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
            ->with(['country', 'state', 'city', 'area', 'deliveryZone'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActive(): Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->with(['country', 'state', 'city', 'area', 'deliveryZone'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(int $id): ?Kitchen
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Kitchen
    {
        return $this->model->where('uuid', $uuid)
            ->with(['country', 'state', 'city', 'area', 'deliveryZone', 'createdBy', 'updatedBy'])
            ->first();
    }

    public function create(KitchenDTO $dto, int $createdBy): Kitchen
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        if (! empty($data['is_default']) && $data['is_default']) {
            $this->unsetOtherDefaults();
        }

        return $this->model->create($data);
    }

    public function update(Kitchen $kitchen, array $data, int $updatedBy): Kitchen
    {
        $data['updated_by'] = $updatedBy;

        if (isset($data['is_default']) && $data['is_default']) {
            $this->unsetOtherDefaults($kitchen->id);
        }

        $kitchen->update($data);

        return $kitchen->fresh();
    }

    public function softDelete(Kitchen $kitchen, int $deletedBy): bool
    {
        $kitchen->deleted_by = $deletedBy;
        $kitchen->save();

        return $kitchen->delete();
    }

    public function restore(int $id): bool
    {
        $kitchen = $this->model->withTrashed()->find($id);

        if (! $kitchen) {
            return false;
        }

        return $kitchen->restore();
    }

    public function forceDelete(Kitchen $kitchen): bool
    {
        return $kitchen->forceDelete();
    }

    public function setDefault(Kitchen $kitchen): Kitchen
    {
        $this->unsetOtherDefaults($kitchen->id);

        $kitchen->is_default = true;
        $kitchen->save();

        return $kitchen->fresh();
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

    public function setStatus(Kitchen $kitchen, string $status): Kitchen
    {
        $kitchen->status = $status;
        $kitchen->save();

        return $kitchen->fresh();
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
                $dto = KitchenDTO::fromArray($row);
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
        $query = $this->model->query()
            ->with(['country', 'state', 'city', 'area', 'deliveryZone']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['kitchen_type'])) {
            $query->where('kitchen_type', $filters['kitchen_type']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('created_at', 'desc')->get();
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

    public function getDefault(): ?Kitchen
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
            ->with(['city', 'area'])
            ->limit(25)
            ->get();
    }

    public function hasRelatedData(Kitchen $kitchen): bool
    {
        if (class_exists(\App\Models\Meal::class)) {
            if ($kitchen->meals()->exists()) {
                return true;
            }
        }

        if (class_exists(\App\Models\Order::class)) {
            if ($kitchen->orders()->exists()) {
                return true;
            }
        }

        return false;
    }
}
