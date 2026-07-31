<?php

declare(strict_types=1);

namespace App\DTOs\Kitchen;

readonly class KitchenWorkingDayDTO
{
    public function __construct(
        public ?int $kitchen_id = null,
        public ?string $day_of_week = null,
        public ?bool $is_working = null,
        public ?string $opening_time = null,
        public ?string $closing_time = null,
        public ?string $preparation_start_time = null,
        public ?string $accept_order_start = null,
        public ?string $accept_order_end = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            kitchen_id: $data['kitchen_id'] ?? null,
            day_of_week: $data['day_of_week'] ?? null,
            is_working: isset($data['is_working']) ? (bool) $data['is_working'] : null,
            opening_time: $data['opening_time'] ?? null,
            closing_time: $data['closing_time'] ?? null,
            preparation_start_time: $data['preparation_start_time'] ?? null,
            accept_order_start: $data['accept_order_start'] ?? null,
            accept_order_end: $data['accept_order_end'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'kitchen_id' => $this->kitchen_id,
            'day_of_week' => $this->day_of_week,
            'is_working' => $this->is_working,
            'opening_time' => $this->opening_time,
            'closing_time' => $this->closing_time,
            'preparation_start_time' => $this->preparation_start_time,
            'accept_order_start' => $this->accept_order_start,
            'accept_order_end' => $this->accept_order_end,
        ], fn ($v) => $v !== null);
    }
}
