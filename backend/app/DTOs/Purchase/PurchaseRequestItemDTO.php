<?php

declare(strict_types=1);

namespace App\DTOs\Purchase;

final class PurchaseRequestItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $inventoryItemId = null,
        public readonly ?float $requestedQuantity = null,
        public readonly ?float $approvedQuantity = null,
        public readonly ?int $unitId = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            inventoryItemId: isset($data['inventory_item_id']) ? (int) $data['inventory_item_id'] : null,
            requestedQuantity: isset($data['requested_quantity']) ? (float) $data['requested_quantity'] : null,
            approvedQuantity: isset($data['approved_quantity']) ? (float) $data['approved_quantity'] : null,
            unitId: isset($data['unit_id']) ? (int) $data['unit_id'] : null,
            remarks: $data['remarks'] ?? null,
        );
    }
}
