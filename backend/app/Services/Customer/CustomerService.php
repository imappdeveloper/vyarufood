<?php

declare(strict_types=1);

namespace App\Services\Customer;

use App\DTOs\Customer\CustomerDTO;
use App\Models\Customer;
use App\Repositories\Customer\CustomerRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerService extends BaseService implements CustomerServiceInterface
{
    protected string $moduleName = 'customer';

    public function __construct(
        protected CustomerRepositoryInterface $customerRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->customerRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('customer', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->customerRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('customer', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->customerRepo->getActive();
        });
    }

    public function findById(int $id): ?Customer
    {
        return $this->customerRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?Customer
    {
        return $this->customerRepo->findByUuid($uuid);
    }

    public function create(array $data): Customer
    {
        return $this->transaction(function () use ($data) {
            $dto = CustomerDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $customer = $this->customerRepo->create($dto, $createdBy);

            CacheManager::flush('customer');

            $this->logInfo('Customer created', ['customer_id' => $customer->id, 'email' => $customer->email]);
            $this->logActivity('customer_created', $customer);

            return $customer;
        });
    }

    public function update(Customer $customer, array $data): Customer
    {
        return $this->transaction(function () use ($customer, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $customer = $this->customerRepo->update($customer, $data, $updatedBy);

            CacheManager::flush('customer');

            $this->logInfo('Customer updated', ['customer_id' => $customer->id, 'email' => $customer->email]);
            $this->logActivity('customer_updated', $customer);

            return $customer;
        });
    }

    public function delete(Customer $customer): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->customerRepo->softDelete($customer, $deletedBy);

        if ($result) {
            CacheManager::flush('customer');

            $this->logInfo('Customer deleted', ['customer_id' => $customer->id, 'email' => $customer->email]);
            $this->logActivity('customer_deleted', $customer);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->customerRepo->restore($id);

        if ($result) {
            CacheManager::flush('customer');

            $this->logInfo('Customer restored', ['customer_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(Customer $customer): bool
    {
        $result = $this->customerRepo->forceDelete($customer);

        if ($result) {
            CacheManager::flush('customer');

            $this->logInfo('Customer force deleted', ['customer_id' => $customer->id, 'email' => $customer->email]);
            $this->logActivity('customer_force_deleted', $customer);
        }

        return $result;
    }

    public function setStatus(Customer $customer, string $status): Customer
    {
        $customer = $this->customerRepo->setStatus($customer, $status);

        CacheManager::flush('customer');

        $this->logInfo('Customer status changed', ['customer_id' => $customer->id, 'status' => $status]);
        $this->logActivity('customer_status_changed', $customer, ['status' => $status]);

        return $customer;
    }

    public function block(Customer $customer, ?string $reason = null): Customer
    {
        $customer = $this->customerRepo->block($customer, $reason);

        CacheManager::flush('customer');

        $this->logInfo('Customer blocked', ['customer_id' => $customer->id, 'reason' => $reason]);
        $this->logActivity('customer_blocked', $customer, ['reason' => $reason]);

        return $customer;
    }

    public function unblock(Customer $customer): Customer
    {
        $customer = $this->customerRepo->unblock($customer);

        CacheManager::flush('customer');

        $this->logInfo('Customer unblocked', ['customer_id' => $customer->id]);
        $this->logActivity('customer_unblocked', $customer);

        return $customer;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->customerRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('customer');

            $this->logInfo('Bulk customers deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->customerRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('customer');

            $this->logInfo('Bulk customers status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->customerRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('customer');

            $this->logInfo('Customers imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->customerRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'first_name', 'last_name', 'email', 'phone', 'country_code', 'gender',
            'date_of_birth', 'address_line_1', 'city_id', 'pincode', 'status', 'remarks',
        ];

        $sampleRow = [
            'Rahul', 'Sharma', 'rahul@example.com', '9876543210', '+91', 'male',
            '1995-05-15', '123 MG Road', '1', '600001', 'active', 'Sample customer',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->customerRepo->countByStatus();
    }

    public function countBlocked(): int
    {
        return $this->customerRepo->countBlocked();
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('customer', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return [
                'total' => $this->customerRepo->countByStatus(),
                'blocked' => $this->customerRepo->countBlocked(),
            ];
        });
    }

    public function search(?string $search): \Illuminate\Database\Eloquent\Collection
    {
        return $this->customerRepo->search($search);
    }
}
