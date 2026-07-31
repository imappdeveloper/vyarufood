<?php

declare(strict_types=1);

namespace App\DTOs\Purchase;

final class GoodsReceiptItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $inventoryItemId = null,
        public readonly ?float $receivedQuantity = null,
        public readonly ?float $unitCost = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            inventoryItemId: isset($data['inventory_item_id']) ? (int) $data['inventory_item_id'] : null,
            receivedQuantity: isset($data['received_quantity']) ? (float) $data['received_quantity'] : null,
            unitCost: isset($data['unit_cost']) ? (float) $data['unit_cost'] : null,
            remarks: $data['remarks'] ?? null,
        );
    }
}
