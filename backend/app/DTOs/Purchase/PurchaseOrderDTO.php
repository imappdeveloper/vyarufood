<?php

declare(strict_types=1);

namespace App\DTOs\Purchase;

final class PurchaseOrderDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $poNumber = null,
        public readonly ?int $supplierId = null,
        public readonly ?int $purchaseRequestId = null,
        public readonly ?string $orderDate = null,
        public readonly ?string $expectedDeliveryDate = null,
        public readonly float $subtotal = 0,
        public readonly float $discountAmount = 0,
        public readonly float $taxAmount = 0,
        public readonly float $shippingCharge = 0,
        public readonly float $otherCharges = 0,
        public readonly float $grandTotal = 0,
        public readonly string $paymentTerms = 'Net 30',
        public readonly string $paymentStatus = 'pending',
        public readonly string $orderStatus = 'draft',
        public readonly ?string $remarks = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
        public readonly ?int $approvedBy = null,
        public readonly ?string $approvedAt = null,
        public readonly array $items = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            poNumber: $data['po_number'] ?? null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            purchaseRequestId: isset($data['purchase_request_id']) ? (int) $data['purchase_request_id'] : null,
            orderDate: $data['order_date'] ?? null,
            expectedDeliveryDate: $data['expected_delivery_date'] ?? null,
            subtotal: isset($data['subtotal']) ? (float) $data['subtotal'] : 0,
            discountAmount: isset($data['discount_amount']) ? (float) $data['discount_amount'] : 0,
            taxAmount: isset($data['tax_amount']) ? (float) $data['tax_amount'] : 0,
            shippingCharge: isset($data['shipping_charge']) ? (float) $data['shipping_charge'] : 0,
            otherCharges: isset($data['other_charges']) ? (float) $data['other_charges'] : 0,
            grandTotal: isset($data['grand_total']) ? (float) $data['grand_total'] : 0,
            paymentTerms: $data['payment_terms'] ?? 'Net 30',
            paymentStatus: $data['payment_status'] ?? 'pending',
            orderStatus: $data['order_status'] ?? 'draft',
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            approvedBy: isset($data['approved_by']) ? (int) $data['approved_by'] : null,
            approvedAt: $data['approved_at'] ?? null,
            items: array_map(fn (array $item) => PurchaseOrderItemDTO::fromArray($item), $data['items'] ?? []),
        );
    }
}
