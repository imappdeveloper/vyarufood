<?php

declare(strict_types=1);

namespace App\DTOs\Kitchen;

readonly class KitchenCapacityDTO
{
    public function __construct(
        public ?int $kitchen_id = null,
        public ?string $capacity_date = null,
        public ?int $breakfast_capacity = null,
        public ?int $lunch_capacity = null,
        public ?int $dinner_capacity = null,
        public ?int $healthy_meal_capacity = null,
        public ?int $snack_capacity = null,
        public ?int $maximum_orders = null,
        public ?int $reserved_orders = null,
        public ?int $available_orders = null,
        public ?string $status = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            kitchen_id: $data['kitchen_id'] ?? null,
            capacity_date: $data['capacity_date'] ?? null,
            breakfast_capacity: isset($data['breakfast_capacity']) ? (int) $data['breakfast_capacity'] : null,
            lunch_capacity: isset($data['lunch_capacity']) ? (int) $data['lunch_capacity'] : null,
            dinner_capacity: isset($data['dinner_capacity']) ? (int) $data['dinner_capacity'] : null,
            healthy_meal_capacity: isset($data['healthy_meal_capacity']) ? (int) $data['healthy_meal_capacity'] : null,
            snack_capacity: isset($data['snack_capacity']) ? (int) $data['snack_capacity'] : null,
            maximum_orders: isset($data['maximum_orders']) ? (int) $data['maximum_orders'] : null,
            reserved_orders: isset($data['reserved_orders']) ? (int) $data['reserved_orders'] : null,
            available_orders: isset($data['available_orders']) ? (int) $data['available_orders'] : null,
            status: $data['status'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'kitchen_id' => $this->kitchen_id,
            'capacity_date' => $this->capacity_date,
            'breakfast_capacity' => $this->breakfast_capacity,
            'lunch_capacity' => $this->lunch_capacity,
            'dinner_capacity' => $this->dinner_capacity,
            'healthy_meal_capacity' => $this->healthy_meal_capacity,
            'snack_capacity' => $this->snack_capacity,
            'maximum_orders' => $this->maximum_orders,
            'reserved_orders' => $this->reserved_orders,
            'available_orders' => $this->available_orders,
            'status' => $this->status,
        ], fn ($v) => $v !== null);
    }
}
