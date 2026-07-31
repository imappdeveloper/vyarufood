<?php

declare(strict_types=1);

namespace App\Repositories\CustomerAddress;

use App\DTOs\CustomerAddress\CustomerAddressDTO;
use App\Enums\StatusEnum;
use App\Models\CustomerAddress;
use App\Models\Master\DeliveryZone;
use App\Models\Master\Pincode;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerAddressRepository extends BaseRepository implements CustomerAddressRepositoryInterface
{
    protected function model(): CustomerAddress
    {
        return new CustomerAddress;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])
            ->search($filters['search'] ?? null);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
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

        if (! empty($filters['address_type'])) {
            $query->where('address_type', $filters['address_type']);
        }

        if (isset($filters['is_default']) && $filters['is_default'] !== '') {
            $query->where('is_default', filter_var($filters['is_default'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_verified']) && $filters['is_verified'] !== '') {
            $query->where('is_verified', filter_var($filters['is_verified'], FILTER_VALIDATE_BOOLEAN));
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
            ->with(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActive(): Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->with(['customer', 'city', 'area', 'deliveryZone'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getById(int $id): ?CustomerAddress
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?CustomerAddress
    {
        return $this->model->where('uuid', $uuid)
            ->with(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode', 'createdBy', 'updatedBy'])
            ->first();
    }

    public function create(CustomerAddressDTO $dto, int $createdBy): CustomerAddress
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        if (! empty($data['is_default']) && $data['is_default']) {
            $this->unsetOtherDefaults((int) $data['customer_id']);
        }

        return $this->model->create($data);
    }

    public function update(CustomerAddress $address, array $data, int $updatedBy): CustomerAddress
    {
        $data['updated_by'] = $updatedBy;

        if (isset($data['is_default']) && $data['is_default']) {
            $this->unsetOtherDefaults((int) $address->customer_id, $address->id);
        }

        $address->update($data);

        return $address->fresh();
    }

    public function softDelete(CustomerAddress $address, int $deletedBy): bool
    {
        $address->deleted_by = $deletedBy;
        $address->save();

        return $address->delete();
    }

    public function restore(int $id): bool
    {
        $address = $this->model->withTrashed()->find($id);

        if (! $address) {
            return false;
        }

        return $address->restore();
    }

    public function forceDelete(CustomerAddress $address): bool
    {
        return $address->forceDelete();
    }

    public function setDefault(CustomerAddress $address): CustomerAddress
    {
        $this->unsetOtherDefaults((int) $address->customer_id, $address->id);

        $address->is_default = true;
        $address->save();

        return $address->fresh();
    }

    public function unsetOtherDefaults(int $customerId, ?int $excludeId = null): void
    {
        $query = $this->model->query()
            ->where('customer_id', $customerId)
            ->where('is_default', true);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $query->update(['is_default' => false]);
    }

    public function verify(CustomerAddress $address, int $verifiedBy): CustomerAddress
    {
        $address->is_verified = true;
        $address->updated_by = $verifiedBy;
        $address->save();

        return $address->fresh();
    }

    public function setStatus(CustomerAddress $address, string $status): CustomerAddress
    {
        $address->status = $status;
        $address->save();

        return $address->fresh();
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
                $dto = CustomerAddressDTO::fromArray($row);
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
            ->with(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode']);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['address_type'])) {
            $query->where('address_type', $filters['address_type']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getDefaultForCustomer(int $customerId): ?CustomerAddress
    {
        return $this->model->query()
            ->where('customer_id', $customerId)
            ->where('is_default', true)
            ->where('status', StatusEnum::Active)
            ->first();
    }

    public function countByCustomer(int $customerId): int
    {
        return $this->model->query()->where('customer_id', $customerId)->count();
    }

    public function countByStatus(): array
    {
        return $this->model->query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function countVerified(): int
    {
        return $this->model->query()->where('is_verified', true)->count();
    }

    public function search(?string $search): Collection
    {
        return $this->model->query()
            ->search($search)
            ->with(['customer', 'city'])
            ->limit(25)
            ->get();
    }

    public function checkServiceAvailability(array $data): array
    {
        $pincodeId = $data['pincode_id'] ?? null;
        $deliveryZoneId = $data['delivery_zone_id'] ?? null;
        $cityId = $data['city_id'] ?? null;

        $zone = null;

        if ($deliveryZoneId) {
            $zone = DeliveryZone::find($deliveryZoneId);
        } elseif ($pincodeId) {
            $pincode = Pincode::with('deliveryZone')->find($pincodeId);
            if ($pincode && $pincode->is_serviceable) {
                $zone = $pincode->deliveryZone;
            }
        } elseif ($cityId) {
            $zone = DeliveryZone::where('city_id', $cityId)
                ->where('status', StatusEnum::Active)
                ->first();
        }

        if (! $zone || $zone->status !== StatusEnum::Active) {
            return [
                'service_available' => false,
                'message' => 'Delivery service is not available for this area.',
            ];
        }

        $slots = $zone->deliverySlots()->where('status', StatusEnum::Active)->get();

        return [
            'service_available' => true,
            'delivery_zone' => [
                'id' => $zone->id,
                'uuid' => $zone->uuid,
                'zone_name' => $zone->zone_name,
                'zone_code' => $zone->zone_code,
                'delivery_radius' => $zone->delivery_radius,
                'delivery_charge' => $zone->delivery_charge,
                'free_delivery_above' => $zone->free_delivery_above,
                'minimum_order_amount' => $zone->minimum_order_amount,
                'estimated_delivery_time' => $zone->estimated_delivery_time,
            ],
            'available_delivery_slots' => $slots->map(fn ($slot) => [
                'id' => $slot->id,
                'uuid' => $slot->uuid,
                'slot_name' => $slot->slot_name,
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
                'cutoff_time' => $slot->cutoff_time,
            ])->toArray(),
        ];
    }
}
