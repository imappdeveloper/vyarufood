<?php

declare(strict_types=1);

namespace App\DTOs\Purchase;

final class PurchaseRequestDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $requestNumber = null,
        public readonly ?string $requestDate = null,
        public readonly string $requestType = 'manual',
        public readonly ?string $requestedBy = null,
        public readonly ?string $department = null,
        public readonly string $priority = 'medium',
        public readonly string $status = 'draft',
        public readonly ?string $expectedDate = null,
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
            requestNumber: $data['request_number'] ?? null,
            requestDate: $data['request_date'] ?? null,
            requestType: $data['request_type'] ?? 'manual',
            requestedBy: $data['requested_by'] ?? null,
            department: $data['department'] ?? null,
            priority: $data['priority'] ?? 'medium',
            status: $data['status'] ?? 'draft',
            expectedDate: $data['expected_date'] ?? null,
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            approvedBy: isset($data['approved_by']) ? (int) $data['approved_by'] : null,
            approvedAt: $data['approved_at'] ?? null,
            items: array_map(fn (array $item) => PurchaseRequestItemDTO::fromArray($item), $data['items'] ?? []),
        );
    }
}
