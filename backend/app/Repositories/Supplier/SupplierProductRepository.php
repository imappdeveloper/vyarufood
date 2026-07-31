<?php

declare(strict_types=1);

namespace App\Repositories\Supplier;

use App\Models\SupplierProduct;
use App\Models\SupplierPriceHistory;
use App\Support\BaseRepository;
use Illuminate\Support\Collection;

class SupplierProductRepository extends BaseRepository implements SupplierProductRepositoryInterface
{
    protected function model(): SupplierProduct
    {
        return new SupplierProduct;
    }

    public function getBySupplier(int $supplierId): Collection
    {
        return $this->model->where('supplier_id', $supplierId)
            ->with(['inventoryItem', 'unit'])
            ->get();
    }

    public function create(array $data): SupplierProduct
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?SupplierProduct
    {
        $record = $this->model->find($id);
        if ($record) {
            $record->update($data);
        }
        return $record;
    }

    public function delete(int $id): bool
    {
        $record = $this->model->find($id);
        return $record ? $record->delete() : false;
    }

    public function updatePrice(int $id, float $newPrice, ?string $remarks = null): SupplierProduct
    {
        $product = $this->model->findOrFail($id);
        $oldPrice = $product->purchase_price;

        $product->update(['purchase_price' => $newPrice]);

        SupplierPriceHistory::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'supplier_id' => $product->supplier_id,
            'inventory_item_id' => $product->inventory_item_id,
            'old_price' => $oldPrice,
            'new_price' => $newPrice,
            'effective_from' => now()->toDateString(),
            'remarks' => $remarks,
        ]);

        return $product->fresh(['inventoryItem', 'unit']);
    }
}
