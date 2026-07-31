<?php

declare(strict_types=1);

namespace App\Repositories\DeliveryZone;

use App\DTOs\DeliveryZone\DeliveryZoneDTO;
use App\Enums\StatusEnum;
use App\Models\Master\DeliveryZone;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DeliveryZoneRepository extends BaseRepository implements DeliveryZoneRepositoryInterface
{
    protected function model(): DeliveryZone
    {
        return new DeliveryZone;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['country', 'state', 'city', 'area'])
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
            'sort_order' => 'priority',
            default => $sort,
        };

        return $query->orderBy($sortColumn, $order)->paginate($perPage);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()->with(['country', 'state', 'city', 'area'])->orderBy('display_order', 'asc')->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('zone_name', 'asc')
            ->get();
    }

    public function getDefault(): ?DeliveryZone
    {
        return $this->model->query()->where('is_default', true)->first();
    }

    public function findById(int $id): ?DeliveryZone
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?DeliveryZone
    {
        return $this->model->where('uuid', $uuid)->with(['country', 'state', 'city', 'area'])->first();
    }

    public function create(DeliveryZoneDTO $dto, int $createdBy): DeliveryZone
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(DeliveryZone $deliveryZone, array $data, int $updatedBy): DeliveryZone
    {
        if (isset($data['sort_order']) && ! isset($data['display_order'])) {
            $data['display_order'] = $data['sort_order'];
            unset($data['sort_order']);
        }
        $data['updated_by'] = $updatedBy;
        $deliveryZone->update($data);

        return $deliveryZone->fresh();
    }

    public function softDelete(DeliveryZone $deliveryZone, int $deletedBy): bool
    {
        $deliveryZone->deleted_by = $deletedBy;
        $deliveryZone->save();

        return $deliveryZone->delete();
    }

    public function restore(int $id): bool
    {
        $deliveryZone = $this->model->withTrashed()->find($id);

        if (! $deliveryZone) {
            return false;
        }

        return $deliveryZone->restore();
    }

    public function forceDelete(DeliveryZone $deliveryZone): bool
    {
        return $deliveryZone->forceDelete();
    }

    public function setStatus(DeliveryZone $deliveryZone, string $status): DeliveryZone
    {
        $deliveryZone->status = $status;
        $deliveryZone->save();

        return $deliveryZone->fresh();
    }

    public function setDefault(DeliveryZone $deliveryZone): bool
    {
        $this->model->query()
            ->where('city_id', $deliveryZone->city_id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        $deliveryZone->is_default = true;
        $deliveryZone->save();

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
                $dto = DeliveryZoneDTO::fromArray($row);
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
        $query = $this->model->query()->with(['country', 'state', 'city', 'area']);

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

        return $query->orderBy('zone_name', 'asc')->get();
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
            ->orderBy('zone_name', 'asc')
            ->get();
    }

    public function hasOrders(int $zoneId): bool
    {
        return false;
    }

    public function hasCustomers(int $zoneId): bool
    {
        return false;
    }
}
