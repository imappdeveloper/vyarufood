<?php

declare(strict_types=1);

namespace App\DTOs\Kitchen;

readonly class ProductionScheduleDTO
{
    public function __construct(
        public ?int $kitchen_id = null,
        public ?string $production_date = null,
        public ?string $meal_type = null,
        public ?int $planned_quantity = null,
        public ?int $produced_quantity = null,
        public ?int $remaining_quantity = null,
        public ?string $production_start = null,
        public ?string $production_end = null,
        public ?string $status = null,
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            kitchen_id: $data['kitchen_id'] ?? null,
            production_date: $data['production_date'] ?? null,
            meal_type: $data['meal_type'] ?? null,
            planned_quantity: isset($data['planned_quantity']) ? (int) $data['planned_quantity'] : null,
            produced_quantity: isset($data['produced_quantity']) ? (int) $data['produced_quantity'] : null,
            remaining_quantity: isset($data['remaining_quantity']) ? (int) $data['remaining_quantity'] : null,
            production_start: $data['production_start'] ?? null,
            production_end: $data['production_end'] ?? null,
            status: $data['status'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'kitchen_id' => $this->kitchen_id,
            'production_date' => $this->production_date,
            'meal_type' => $this->meal_type,
            'planned_quantity' => $this->planned_quantity,
            'produced_quantity' => $this->produced_quantity,
            'remaining_quantity' => $this->remaining_quantity,
            'production_start' => $this->production_start,
            'production_end' => $this->production_end,
            'status' => $this->status,
            'remarks' => $this->remarks,
        ], fn ($v) => $v !== null);
    }
}
