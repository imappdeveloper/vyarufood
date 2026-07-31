<?php

declare(strict_types=1);

namespace App\DTOs\ProductionBatch;

final class ProductionBatchDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $batchNumber = null,
        public readonly ?string $productionDate = null,
        public readonly ?int $kitchenId = null,
        public readonly ?string $batchName = null,
        public readonly string $batchType = 'regular',
        public readonly ?string $plannedStartTime = null,
        public readonly ?string $plannedEndTime = null,
        public readonly ?string $remarks = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            batchNumber: $data['batch_number'] ?? null,
            productionDate: $data['production_date'] ?? null,
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : null,
            batchName: $data['batch_name'] ?? null,
            batchType: $data['batch_type'] ?? 'regular',
            plannedStartTime: $data['planned_start_time'] ?? null,
            plannedEndTime: $data['planned_end_time'] ?? null,
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
        );
    }
}
