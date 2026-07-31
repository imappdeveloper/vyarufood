<?php

declare(strict_types=1);

namespace App\DTOs\Supplier;

final class SupplierDocumentDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $supplierId = null,
        public readonly string $documentType = 'other',
        public readonly ?string $documentName = null,
        public readonly ?string $documentPath = null,
        public readonly ?string $expiryDate = null,
        public readonly string $status = 'active',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            documentType: $data['document_type'] ?? 'other',
            documentName: $data['document_name'] ?? null,
            documentPath: $data['document_path'] ?? null,
            expiryDate: $data['expiry_date'] ?? null,
            status: $data['status'] ?? 'active',
        );
    }

    public function toArray(): array
    {
        return [
            'document_type' => $this->documentType,
            'document_name' => $this->documentName,
            'document_path' => $this->documentPath,
            'expiry_date' => $this->expiryDate,
            'status' => $this->status,
        ];
    }
}
