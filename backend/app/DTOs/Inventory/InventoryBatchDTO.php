<?php
declare(strict_types=1);

namespace App\DTOs\Inventory;

final readonly class InventoryBatchDTO
{
    public function __construct(
        public int $inventoryItemId,
        public string $batchNumber,
        public ?string $lotNumber = null,
        public ?string $manufacturingDate = null,
        public ?string $expiryDate = null,
        public ?string $receivedDate = null,
        public float $availableQuantity = 0,
        public float $reservedQuantity = 0,
        public float $unitCost = 0,
        public ?int $supplierId = null,
        public ?int $purchaseOrderId = null,
        public ?int $goodsReceiptId = null,
        public string $status = 'active',
    ) {}

    public function toArray(): array
    {
        return [
            'inventory_item_id' => $this->inventoryItemId,
            'batch_number' => $this->batchNumber,
            'lot_number' => $this->lotNumber,
            'manufacturing_date' => $this->manufacturingDate,
            'expiry_date' => $this->expiryDate,
            'received_date' => $this->receivedDate,
            'available_quantity' => $this->availableQuantity,
            'reserved_quantity' => $this->reservedQuantity,
            'unit_cost' => $this->unitCost,
            'supplier_id' => $this->supplierId,
            'purchase_order_id' => $this->purchaseOrderId,
            'goods_receipt_id' => $this->goodsReceiptId,
            'status' => $this->status,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            inventoryItemId: (int) $data['inventory_item_id'],
            batchNumber: $data['batch_number'] ?? '',
            lotNumber: $data['lot_number'] ?? null,
            manufacturingDate: $data['manufacturing_date'] ?? null,
            expiryDate: $data['expiry_date'] ?? null,
            receivedDate: $data['received_date'] ?? null,
            availableQuantity: (float) ($data['available_quantity'] ?? 0),
            reservedQuantity: (float) ($data['reserved_quantity'] ?? 0),
            unitCost: (float) ($data['unit_cost'] ?? 0),
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            purchaseOrderId: isset($data['purchase_order_id']) ? (int) $data['purchase_order_id'] : null,
            goodsReceiptId: isset($data['goods_receipt_id']) ? (int) $data['goods_receipt_id'] : null,
            status: $data['status'] ?? 'active',
        );
    }
}
