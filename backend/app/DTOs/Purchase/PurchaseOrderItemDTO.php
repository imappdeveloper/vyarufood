<?php

declare(strict_types=1);

namespace App\DTOs\Purchase;

final class PurchaseOrderItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $inventoryItemId = null,
        public readonly ?float $orderedQuantity = null,
        public readonly ?float $unitPrice = null,
        public readonly ?float $taxPercentage = null,
        public readonly ?float $discount = null,
        public readonly ?int $unitId = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            inventoryItemId: isset($data['inventory_item_id']) ? (int) $data['inventory_item_id'] : null,
            orderedQuantity: isset($data['ordered_quantity']) ? (float) $data['ordered_quantity'] : null,
            unitPrice: isset($data['unit_price']) ? (float) $data['unit_price'] : null,
            taxPercentage: isset($data['tax_percentage']) ? (float) $data['tax_percentage'] : null,
            discount: isset($data['discount']) ? (float) $data['discount'] : null,
            unitId: isset($data['unit_id']) ? (int) $data['unit_id'] : null,
            remarks: $data['remarks'] ?? null,
        );
    }
}
