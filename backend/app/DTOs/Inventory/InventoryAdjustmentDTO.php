<?php
declare(strict_types=1);

namespace App\DTOs\Inventory;

final readonly class InventoryAdjustmentDTO
{
    public function __construct(
        public int $inventoryItemId,
        public string $adjustmentType,
        public float $adjustmentQuantity,
        public string $reason,
        public ?string $remarks = null,
    ) {}

    public function toArray(): array
    {
        return [
            'inventory_item_id' => $this->inventoryItemId,
            'adjustment_type' => $this->adjustmentType,
            'adjustment_quantity' => $this->adjustmentQuantity,
            'reason' => $this->reason,
            'remarks' => $this->remarks,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            inventoryItemId: (int) $data['inventory_item_id'],
            adjustmentType: $data['adjustment_type'] ?? '',
            adjustmentQuantity: (float) ($data['adjustment_quantity'] ?? 0),
            reason: $data['reason'] ?? '',
            remarks: $data['remarks'] ?? null,
        );
    }
}
