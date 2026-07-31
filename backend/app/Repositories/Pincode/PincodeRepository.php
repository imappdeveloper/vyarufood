<?php

declare(strict_types=1);

namespace App\Repositories\Pincode;

use App\DTOs\Pincode\PincodeDTO;
use App\Enums\StatusEnum;
use App\Models\Master\Pincode;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PincodeRepository extends BaseRepository implements PincodeRepositoryInterface
{
    protected function model(): Pincode
    {
        return new Pincode;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['deliveryZone', 'country', 'state', 'city', 'area'])
            ->search($filters['search'] ?? null);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_serviceable']) && $filters['is_serviceable'] !== '') {
            $query->where('is_serviceable', filter_var($filters['is_serviceable'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['delivery_zone_id'])) {
            $query->where('delivery_zone_id', $filters['delivery_zone_id']);
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

        if (! empty($filters['pincode'])) {
            $query->where('pincode', $filters['pincode']);
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
        return $this->model->query()->with(['deliveryZone', 'country', 'state', 'city', 'area'])->orderBy('display_order', 'asc')->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->orderBy('pincode', 'asc')
            ->get();
    }

    public function findById(int $id): ?Pincode
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Pincode
    {
        return $this->model->where('uuid', $uuid)->with(['deliveryZone', 'country', 'state', 'city', 'area'])->first();
    }

    public function findByPincode(string $pincode): ?Pincode
    {
        return $this->model->where('pincode', $pincode)->first();
    }

    public function create(PincodeDTO $dto, int $createdBy): Pincode
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        return $this->model->create($data);
    }

    public function update(Pincode $pincode, array $data, int $updatedBy): Pincode
    {
        $data['updated_by'] = $updatedBy;
        $pincode->update($data);

        return $pincode->fresh();
    }

    public function softDelete(Pincode $pincode, int $deletedBy): bool
    {
        $pincode->deleted_by = $deletedBy;
        $pincode->save();

        return $pincode->delete();
    }

    public function restore(int $id): bool
    {
        $pincode = $this->model->withTrashed()->find($id);

        if (! $pincode) {
            return false;
        }

        return $pincode->restore();
    }

    public function forceDelete(Pincode $pincode): bool
    {
        return $pincode->forceDelete();
    }

    public function setStatus(Pincode $pincode, string $status): Pincode
    {
        $pincode->status = $status;
        $pincode->save();

        return $pincode->fresh();
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
                $dto = PincodeDTO::fromArray($row);
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
        $query = $this->model->query()->with(['deliveryZone', 'country', 'state', 'city', 'area']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['delivery_zone_id'])) {
            $query->where('delivery_zone_id', $filters['delivery_zone_id']);
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

        return $query->orderBy('pincode', 'asc')->get();
    }

    public function countByStatus(): array
    {
        return $this->model->query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getActiveByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('delivery_zone_id', $zoneId)
            ->where('status', StatusEnum::Active)
            ->orderBy('pincode', 'asc')
            ->get();
    }

    public function getActiveByPincode(string $pincode): ?Pincode
    {
        return $this->model->query()
            ->where('pincode', $pincode)
            ->where('status', StatusEnum::Active)
            ->first();
    }
}
