<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierContactDTO;
use App\Models\SupplierContact;
use App\Repositories\Supplier\SupplierContactRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Support\Collection;

class SupplierContactService extends BaseService implements SupplierContactServiceInterface
{
    protected string $moduleName = 'supplier_contact';

    public function __construct(
        protected SupplierContactRepositoryInterface $contactRepo,
    ) {}

    public function getBySupplier(int $supplierId): Collection
    {
        return $this->contactRepo->getBySupplier($supplierId);
    }

    public function create(SupplierContactDTO $dto): SupplierContact
    {
        return $this->transaction(function () use ($dto) {
            $data = $dto->toArray();

            $contact = $this->contactRepo->create($data);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier contact created', ['contact_id' => $contact->id]);

            return $contact;
        });
    }

    public function update(int $id, SupplierContactDTO $dto): ?SupplierContact
    {
        return $this->transaction(function () use ($id, $dto) {
            $contact = $this->contactRepo->update($id, $dto->toArray());

            if (! $contact) {
                throw new \RuntimeException('Supplier contact not found.');
            }

            CacheManager::flush('supplier');
            $this->logInfo('Supplier contact updated', ['contact_id' => $id]);

            return $contact->fresh();
        });
    }

    public function delete(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->contactRepo->delete($id);

            if ($result) {
                CacheManager::flush('supplier');
                $this->logInfo('Supplier contact deleted', ['contact_id' => $id]);
            }

            return $result;
        });
    }
}
