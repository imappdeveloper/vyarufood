<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierDTO;
use App\Events\Supplier\{SupplierCreated, SupplierUpdated, SupplierDeleted, SupplierStatusChanged, SupplierBlacklisted, SupplierRestored};
use App\Models\Supplier;
use App\Repositories\Supplier\SupplierRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SupplierService extends BaseService implements SupplierServiceInterface
{
    protected string $moduleName = 'supplier';

    public function __construct(
        protected SupplierRepositoryInterface $supplierRepo,
    ) {}

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->supplierRepo->getPaginated($filters, $perPage);
    }

    public function getById(int $id): ?Supplier
    {
        return $this->supplierRepo->getById($id);
    }

    public function getByUuid(string $uuid): ?Supplier
    {
        return $this->supplierRepo->getByUuid($uuid);
    }

    public function create(SupplierDTO $dto): Supplier
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = array_merge($dto->toArray(), [
                'supplier_code' => $this->supplierRepo->generateSupplierCode(),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $supplier = $this->supplierRepo->create($data);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier created', ['supplier_id' => $supplier->id, 'code' => $supplier->supplier_code]);
            $this->logActivity('supplier_created', $supplier);

            SupplierCreated::dispatch($supplier);

            return $supplier->fresh(['country', 'state', 'city']);
        });
    }

    public function update(int $id, SupplierDTO $dto): ?Supplier
    {
        return $this->transaction(function () use ($id, $dto) {
            $supplier = $this->supplierRepo->getById($id);

            if (! $supplier) {
                throw new \RuntimeException('Supplier not found.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter($dto->toArray(), fn ($v) => $v !== null);
            $data['updated_by'] = $adminId;

            $this->supplierRepo->update($id, $data);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier updated', ['supplier_id' => $id]);
            $this->logActivity('supplier_updated', $supplier);

            SupplierUpdated::dispatch($supplier->fresh());

            return $this->supplierRepo->getById($id);
        });
    }

    public function delete(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $supplier = $this->supplierRepo->getById($id);

            if (! $supplier) {
                throw new \RuntimeException('Supplier not found.');
            }

            if ($supplier->purchaseOrders()->count() > 0) {
                throw new \RuntimeException('Cannot delete supplier with existing purchase orders.');
            }

            $supplier->delete();

            CacheManager::flush('supplier');
            $this->logInfo('Supplier deleted', ['supplier_id' => $id]);
            $this->logActivity('supplier_deleted', $supplier);

            SupplierDeleted::dispatch($supplier);

            return true;
        });
    }

    public function changeStatus(int $id, string $status): ?Supplier
    {
        return $this->transaction(function () use ($id, $status) {
            $supplier = $this->supplierRepo->getById($id);

            if (! $supplier) {
                throw new \RuntimeException('Supplier not found.');
            }

            $oldStatus = $supplier->status;
            $this->supplierRepo->update($id, ['status' => $status, 'updated_by' => auth()->guard('admin')->id()]);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier status changed', ['supplier_id' => $id, 'from' => $oldStatus, 'to' => $status]);

            SupplierStatusChanged::dispatch($supplier->fresh(), $oldStatus, $status);

            return $this->supplierRepo->getById($id);
        });
    }

    public function blacklist(int $id, ?string $reason = null): ?Supplier
    {
        return $this->transaction(function () use ($id, $reason) {
            $supplier = $this->supplierRepo->getById($id);

            if (! $supplier) {
                throw new \RuntimeException('Supplier not found.');
            }

            $this->supplierRepo->update($id, [
                'status' => 'blacklisted',
                'remarks' => $reason ?? $supplier->remarks,
                'updated_by' => auth()->guard('admin')->id(),
            ]);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier blacklisted', ['supplier_id' => $id, 'reason' => $reason]);

            SupplierBlacklisted::dispatch($supplier->fresh(), $reason);

            return $this->supplierRepo->getById($id);
        });
    }

    public function restore(int $id): ?Supplier
    {
        return $this->transaction(function () use ($id) {
            $supplier = $this->supplierRepo->getById($id);

            if (! $supplier) {
                throw new \RuntimeException('Supplier not found.');
            }

            $this->supplierRepo->update($id, [
                'status' => 'active',
                'updated_by' => auth()->guard('admin')->id(),
            ]);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier restored', ['supplier_id' => $id]);

            SupplierRestored::dispatch($supplier->fresh());

            return $this->supplierRepo->getById($id);
        });
    }

    public function getStats(): array
    {
        return $this->supplierRepo->countByStatus();
    }

    public function getPreferred(): Collection
    {
        return $this->supplierRepo->getPreferred();
    }

    public function getExpiringDocuments(int $days): Collection
    {
        return $this->supplierRepo->getExpiringDocuments($days);
    }

    public function getDashboardStats(): array
    {
        $stats = $this->supplierRepo->countByStatus();
        $stats['expiring_documents_30_days'] = $this->supplierRepo->getExpiringDocuments(30)->count();

        return $stats;
    }
}
