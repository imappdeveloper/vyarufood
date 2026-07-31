<?php

declare(strict_types=1);

namespace App\Repositories\DeliveryZone;

use App\DTOs\DeliveryZone\DeliverySlotDTO;
use App\Enums\StatusEnum;
use App\Models\Master\DeliverySlot;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DeliverySlotRepository extends BaseRepository implements DeliverySlotRepositoryInterface
{
    protected function model(): DeliverySlot
    {
        return new DeliverySlot;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order, ?int $zoneId = null): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['deliveryZone'])
            ->search($filters['search'] ?? null);

        if ($zoneId !== null) {
            $query->where('delivery_zone_id', $zoneId);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['delivery_zone_id'])) {
            $query->where('delivery_zone_id', $filters['delivery_zone_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAllByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('delivery_zone_id', $zoneId)
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getActiveByZone(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('delivery_zone_id', $zoneId)
            ->where('status', StatusEnum::Active)
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function findById(int $id): ?DeliverySlot
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?DeliverySlot
    {
        return $this->model->where('uuid', $uuid)->with(['deliveryZone'])->first();
    }

    public function create(DeliverySlotDTO $dto): DeliverySlot
    {
        $data = $dto->toArray();

        return $this->model->create($data);
    }

    public function update(DeliverySlot $deliverySlot, array $data): DeliverySlot
    {
        $deliverySlot->update($data);

        return $deliverySlot;
    }

    public function delete(DeliverySlot $deliverySlot): bool
    {
        $deliverySlot->delete();

        return true;
    }

    public function restore(int $id): bool
    {
        $deliverySlot = $this->model->withTrashed()->find($id);

        if (! $deliverySlot) {
            return false;
        }

        return $deliverySlot->restore();
    }

    public function forceDelete(DeliverySlot $deliverySlot): bool
    {
        return $deliverySlot->forceDelete();
    }

    public function setStatus(DeliverySlot $deliverySlot, string $status): DeliverySlot
    {
        $deliverySlot->status = $status;
        $deliverySlot->save();

        return $deliverySlot->fresh();
    }

    public function getAvailableSlots(int $zoneId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('delivery_zone_id', $zoneId)
            ->where('status', StatusEnum::Active)
            ->orderBy('start_time', 'asc')
            ->get();
    }
}
