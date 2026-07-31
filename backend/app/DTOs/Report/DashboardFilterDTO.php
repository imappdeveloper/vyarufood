<?php

declare(strict_types=1);

namespace App\DTOs\Report;

final class DashboardFilterDTO
{
    public function __construct(
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly ?int $kitchenId = null,
        public readonly ?int $cityId = null,
        public readonly ?int $mealCategoryId = null,
        public readonly ?int $customerId = null,
        public readonly ?int $categoryId = null,
    ) {
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            dateFrom: $data['date_from'] ?? null,
            dateTo: $data['date_to'] ?? null,
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : null,
            cityId: isset($data['city_id']) ? (int) $data['city_id'] : null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            customerId: isset($data['customer_id']) ? (int) $data['customer_id'] : null,
            categoryId: isset($data['category_id']) ? (int) $data['category_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'kitchen_id' => $this->kitchenId,
            'city_id' => $this->cityId,
            'meal_category_id' => $this->mealCategoryId,
            'customer_id' => $this->customerId,
            'category_id' => $this->categoryId,
        ];
    }
}
