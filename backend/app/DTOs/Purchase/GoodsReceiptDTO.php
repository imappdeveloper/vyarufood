<?php

declare(strict_types=1);

namespace App\DTOs\Purchase;

final class GoodsReceiptDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $grnNumber = null,
        public readonly ?int $purchaseOrderId = null,
        public readonly ?int $supplierId = null,
        public readonly ?string $receivedDate = null,
        public readonly string $status = 'pending',
        public readonly ?string $remarks = null,
        public readonly ?string $receivedBy = null,
        public readonly array $items = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            grnNumber: $data['grn_number'] ?? null,
            purchaseOrderId: isset($data['purchase_order_id']) ? (int) $data['purchase_order_id'] : null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            receivedDate: $data['received_date'] ?? null,
            status: $data['status'] ?? 'pending',
            remarks: $data['remarks'] ?? null,
            receivedBy: $data['received_by'] ?? null,
            items: array_map(fn (array $item) => GoodsReceiptItemDTO::fromArray($item), $data['items'] ?? []),
        );
    }
}
