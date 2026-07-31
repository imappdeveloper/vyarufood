<?php

declare(strict_types=1);

namespace App\DTOs\Order;

final class OrderItemDTO
{
    public function __construct(
        public readonly ?int $mealId = null,
        public readonly string $mealName = '',
        public readonly ?int $mealCategoryId = null,
        public readonly ?int $mealTypeId = null,
        public readonly int $quantity = 1,
        public readonly float $unitPrice = 0,
        public readonly float $tax = 0,
        public readonly float $discount = 0,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            mealName: $data['meal_name'] ?? '',
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            mealTypeId: isset($data['meal_type_id']) ? (int) $data['meal_type_id'] : null,
            quantity: isset($data['quantity']) ? (int) $data['quantity'] : 1,
            unitPrice: isset($data['unit_price']) ? (float) $data['unit_price'] : 0,
            tax: isset($data['tax']) ? (float) $data['tax'] : 0,
            discount: isset($data['discount']) ? (float) $data['discount'] : 0,
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array { return get_object_vars($this); }
}
