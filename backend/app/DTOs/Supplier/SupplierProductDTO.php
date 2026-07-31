<?php

declare(strict_types=1);

namespace App\DTOs\Supplier;

final class SupplierProductDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $supplierId = null,
        public readonly ?int $inventoryItemId = null,
        public readonly ?string $supplierProductCode = null,
        public readonly ?string $supplierProductName = null,
        public readonly float $purchasePrice = 0,
        public readonly float $minimumOrderQuantity = 1,
        public readonly ?float $maximumOrderQuantity = null,
        public readonly int $leadTimeDays = 0,
        public readonly ?int $unitId = null,
        public readonly bool $isPrimarySupplier = false,
        public readonly string $status = 'active',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            inventoryItemId: isset($data['inventory_item_id']) ? (int) $data['inventory_item_id'] : null,
            supplierProductCode: $data['supplier_product_code'] ?? null,
            supplierProductName: $data['supplier_product_name'] ?? null,
            purchasePrice: (float) ($data['purchase_price'] ?? 0),
            minimumOrderQuantity: (float) ($data['minimum_order_quantity'] ?? 1),
            maximumOrderQuantity: isset($data['maximum_order_quantity']) ? (float) $data['maximum_order_quantity'] : null,
            leadTimeDays: (int) ($data['lead_time_days'] ?? 0),
            unitId: isset($data['unit_id']) ? (int) $data['unit_id'] : null,
            isPrimarySupplier: (bool) ($data['is_primary_supplier'] ?? false),
            status: $data['status'] ?? 'active',
        );
    }

    public function toArray(): array
    {
        return [
            'supplier_id' => $this->supplierId,
            'inventory_item_id' => $this->inventoryItemId,
            'supplier_product_code' => $this->supplierProductCode,
            'supplier_product_name' => $this->supplierProductName,
            'purchase_price' => $this->purchasePrice,
            'minimum_order_quantity' => $this->minimumOrderQuantity,
            'maximum_order_quantity' => $this->maximumOrderQuantity,
            'lead_time_days' => $this->leadTimeDays,
            'unit_id' => $this->unitId,
            'is_primary_supplier' => $this->isPrimarySupplier,
            'status' => $this->status,
        ];
    }
}
