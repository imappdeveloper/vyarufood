<?php

declare(strict_types=1);

namespace App\Services\CustomerAddress;

use App\DTOs\CustomerAddress\CustomerAddressDTO;
use App\Models\CustomerAddress;
use App\Repositories\CustomerAddress\CustomerAddressRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerAddressService extends BaseService implements CustomerAddressServiceInterface
{
    protected string $moduleName = 'customer_address';

    public function __construct(
        protected CustomerAddressRepositoryInterface $addressRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->addressRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        $cacheKey = CacheManager::cacheKey('customer_address', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->addressRepo->getAll();
        });
    }

    public function getActive(): Collection
    {
        $cacheKey = CacheManager::cacheKey('customer_address', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->addressRepo->getActive();
        });
    }

    public function getById(int $id): ?CustomerAddress
    {
        return $this->addressRepo->getById($id);
    }

    public function findByUuid(string $uuid): ?CustomerAddress
    {
        return $this->addressRepo->findByUuid($uuid);
    }

    public function create(array $data): CustomerAddress
    {
        return $this->transaction(function () use ($data) {
            $dto = CustomerAddressDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $address = $this->addressRepo->create($dto, $createdBy);

            CacheManager::flush('customer_address');

            $this->logInfo('Customer address created', ['address_id' => $address->id, 'customer_id' => $address->customer_id]);
            $this->logActivity('customer_address_created', $address);

            return $address;
        });
    }

    public function update(CustomerAddress $address, array $data): CustomerAddress
    {
        return $this->transaction(function () use ($address, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $address = $this->addressRepo->update($address, $data, $updatedBy);

            CacheManager::flush('customer_address');

            $this->logInfo('Customer address updated', ['address_id' => $address->id]);
            $this->logActivity('customer_address_updated', $address);

            return $address;
        });
    }

    public function delete(CustomerAddress $address): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->addressRepo->softDelete($address, $deletedBy);

        if ($result) {
            CacheManager::flush('customer_address');

            $this->logInfo('Customer address deleted', ['address_id' => $address->id]);
            $this->logActivity('customer_address_deleted', $address);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->addressRepo->restore($id);

        if ($result) {
            CacheManager::flush('customer_address');

            $this->logInfo('Customer address restored', ['address_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(CustomerAddress $address): bool
    {
        $result = $this->addressRepo->forceDelete($address);

        if ($result) {
            CacheManager::flush('customer_address');

            $this->logInfo('Customer address force deleted', ['address_id' => $address->id]);
        }

        return $result;
    }

    public function setDefault(CustomerAddress $address): CustomerAddress
    {
        $address = $this->addressRepo->setDefault($address);

        CacheManager::flush('customer_address');

        $this->logInfo('Customer address set as default', ['address_id' => $address->id, 'customer_id' => $address->customer_id]);
        $this->logActivity('customer_address_default_changed', $address);

        return $address;
    }

    public function verify(CustomerAddress $address): CustomerAddress
    {
        $verifiedBy = auth()->guard('admin')->id();

        $address = $this->addressRepo->verify($address, $verifiedBy);

        CacheManager::flush('customer_address');

        $this->logInfo('Customer address verified', ['address_id' => $address->id]);
        $this->logActivity('customer_address_verified', $address);

        return $address;
    }

    public function setStatus(CustomerAddress $address, string $status): CustomerAddress
    {
        $address = $this->addressRepo->setStatus($address, $status);

        CacheManager::flush('customer_address');

        $this->logInfo('Customer address status changed', ['address_id' => $address->id, 'status' => $status]);
        $this->logActivity('customer_address_status_changed', $address, ['status' => $status]);

        return $address;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->addressRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('customer_address');

            $this->logInfo('Bulk customer addresses deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->addressRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('customer_address');

            $this->logInfo('Bulk customer addresses status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->addressRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('customer_address');

            $this->logInfo('Customer addresses imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): Collection
    {
        return $this->addressRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'customer_id', 'country_id', 'state_id', 'city_id', 'area_id',
            'delivery_zone_id', 'pincode_id', 'address_type', 'house_no',
            'building_name', 'floor', 'street', 'landmark', 'address_line_1',
            'latitude', 'longitude', 'contact_person', 'contact_mobile',
            'delivery_instruction', 'is_default', 'status',
        ];

        $sampleRow = [
            '1', '1', '3', '3', '', '', '', 'home', '12A',
            'Sunshine Apartments', '3rd Floor', 'Main Road', 'Near Temple',
            '12A Main Road, Velachery', '13.0067', '80.2206', 'Rahul Sharma',
            '9876543210', 'Ring the bell twice', 'true', 'active',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('customer_address', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return [
                'total_by_status' => $this->addressRepo->countByStatus(),
                'verified' => $this->addressRepo->countVerified(),
            ];
        });
    }

    public function getDefaultForCustomer(int $customerId): ?CustomerAddress
    {
        return $this->addressRepo->getDefaultForCustomer($customerId);
    }

    public function checkServiceAvailability(array $data): array
    {
        return $this->addressRepo->checkServiceAvailability($data);
    }

    public function search(?string $search): Collection
    {
        return $this->addressRepo->search($search);
    }
}
