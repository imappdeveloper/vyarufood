<?php

declare(strict_types=1);

namespace App\Services\Supplier;

use App\DTOs\Supplier\SupplierProductDTO;
use App\Events\Supplier\SupplierPriceUpdated;
use App\Models\SupplierProduct;
use App\Repositories\Supplier\SupplierProductRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Support\Collection;

class SupplierProductService extends BaseService implements SupplierProductServiceInterface
{
    protected string $moduleName = 'supplier_product';

    public function __construct(
        protected SupplierProductRepositoryInterface $productRepo,
    ) {}

    public function getBySupplier(int $supplierId): Collection
    {
        return $this->productRepo->getBySupplier($supplierId);
    }

    public function create(SupplierProductDTO $dto): SupplierProduct
    {
        return $this->transaction(function () use ($dto) {
            $data = $dto->toArray();

            $product = $this->productRepo->create($data);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier product created', ['product_id' => $product->id]);

            return $product->fresh(['inventoryItem', 'unit']);
        });
    }

    public function update(int $id, SupplierProductDTO $dto): ?SupplierProduct
    {
        return $this->transaction(function () use ($id, $dto) {
            $product = $this->productRepo->update($id, $dto->toArray());

            if (! $product) {
                throw new \RuntimeException('Supplier product not found.');
            }

            CacheManager::flush('supplier');
            $this->logInfo('Supplier product updated', ['product_id' => $id]);

            return $this->productRepo->update($id, $dto->toArray())?->fresh(['inventoryItem', 'unit']) ?? $product->fresh(['inventoryItem', 'unit']);
        });
    }

    public function delete(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $result = $this->productRepo->delete($id);

            if ($result) {
                CacheManager::flush('supplier');
                $this->logInfo('Supplier product deleted', ['product_id' => $id]);
            }

            return $result;
        });
    }

    public function updatePrice(int $id, float $newPrice, ?string $remarks = null): SupplierProduct
    {
        return $this->transaction(function () use ($id, $newPrice, $remarks) {
            $product = $this->productRepo->updatePrice($id, $newPrice, $remarks);

            CacheManager::flush('supplier');
            $this->logInfo('Supplier product price updated', ['product_id' => $id, 'new_price' => $newPrice]);

            SupplierPriceUpdated::dispatch($product->fresh(['inventoryItem', 'unit']));

            return $product;
        });
    }
}
