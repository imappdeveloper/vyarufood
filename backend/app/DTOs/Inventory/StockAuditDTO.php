<?php
declare(strict_types=1);

namespace App\DTOs\Inventory;

final readonly class StockAuditDTO
{
    public function __construct(
        public int $inventoryItemId,
        public string $auditDate,
        public float $systemQuantity,
        public float $physicalQuantity,
        public float $differenceQuantity,
        public ?string $remarks = null,
    ) {}

    public function toArray(): array
    {
        return [
            'inventory_item_id' => $this->inventoryItemId,
            'audit_date' => $this->auditDate,
            'system_quantity' => $this->systemQuantity,
            'physical_quantity' => $this->physicalQuantity,
            'difference_quantity' => $this->differenceQuantity,
            'remarks' => $this->remarks,
        ];
    }

    public static function fromArray(array $data): self
    {
        $systemQty = (float) ($data['system_quantity'] ?? 0);
        $physicalQty = (float) ($data['physical_quantity'] ?? 0);
        return new self(
            inventoryItemId: (int) $data['inventory_item_id'],
            auditDate: $data['audit_date'] ?? now()->toDateString(),
            systemQuantity: $systemQty,
            physicalQuantity: $physicalQty,
            differenceQuantity: $physicalQty - $systemQty,
            remarks: $data['remarks'] ?? null,
        );
    }
}
