<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierDocumentDTO;
use App\Events\Supplier\SupplierDocumentUploaded;
use App\Models\SupplierDocument;
use App\Repositories\Supplier\SupplierDocumentRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Support\Collection;

class SupplierDocumentService extends BaseService implements SupplierDocumentServiceInterface
{
    protected string $moduleName = 'supplier_document';

    public function __construct(
        protected SupplierDocumentRepositoryInterface $documentRepo,
    ) {}

    public function getBySupplier(int $supplierId): Collection
    {
        return $this->documentRepo->getBySupplier($supplierId);
    }

    public function create(SupplierDocumentDTO $dto): SupplierDocument
    {
        return $this->transaction(function () use ($dto) {
            $data = $dto->toArray();

            $document = $this->documentRepo->create($data);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier document created', ['document_id' => $document->id]);

            SupplierDocumentUploaded::dispatch($document->fresh('supplier'));

            return $document;
        });
    }

    public function delete(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->documentRepo->delete($id);

            if ($result) {
                CacheManager::flush('supplier');
                $this->logInfo('Supplier document deleted', ['document_id' => $id]);
            }

            return $result;
        });
    }

    public function getExpiringSoon(int $days): Collection
    {
        return $this->documentRepo->getExpiringSoon($days);
    }
}
