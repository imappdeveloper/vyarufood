<?php

declare(strict_types=1);

namespace App\DTOs\Kitchen;

readonly class KitchenHolidayDTO
{
    public function __construct(
        public ?int $kitchen_id = null,
        public ?string $holiday_name = null,
        public ?string $holiday_type = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?string $reason = null,
        public ?string $status = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            kitchen_id: $data['kitchen_id'] ?? null,
            holiday_name: $data['holiday_name'] ?? null,
            holiday_type: $data['holiday_type'] ?? null,
            start_date: $data['start_date'] ?? null,
            end_date: $data['end_date'] ?? null,
            reason: $data['reason'] ?? null,
            status: $data['status'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'kitchen_id' => $this->kitchen_id,
            'holiday_name' => $this->holiday_name,
            'holiday_type' => $this->holiday_type,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'reason' => $this->reason,
            'status' => $this->status,
        ], fn ($v) => $v !== null);
    }
}
