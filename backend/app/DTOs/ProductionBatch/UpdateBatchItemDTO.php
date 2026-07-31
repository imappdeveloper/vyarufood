<?php

declare(strict_types=1);

namespace App\DTOs\ProductionBatch;

final class UpdateBatchItemDTO
{
    public function __construct(
        public readonly int $id,
        public readonly ?int $preparedQuantity = null,
        public readonly ?int $packedQuantity = null,
        public readonly ?int $wastageQuantity = null,
        public readonly ?string $status = null,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: (int) $data['id'],
            preparedQuantity: isset($data['prepared_quantity']) ? (int) $data['prepared_quantity'] : null,
            packedQuantity: isset($data['packed_quantity']) ? (int) $data['packed_quantity'] : null,
            wastageQuantity: isset($data['wastage_quantity']) ? (int) $data['wastage_quantity'] : null,
            status: $data['status'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }
}
