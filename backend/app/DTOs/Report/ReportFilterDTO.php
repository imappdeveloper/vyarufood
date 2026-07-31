<?php

declare(strict_types=1);

namespace App\DTOs\Report;

final class ReportFilterDTO
{
    public function __construct(
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
        public readonly string $groupBy = 'day',
        public readonly ?int $kitchenId = null,
        public readonly ?int $cityId = null,
        public readonly ?int $mealId = null,
        public readonly ?int $mealCategoryId = null,
        public readonly ?int $customerId = null,
        public readonly ?string $status = null,
        public readonly ?string $channel = null,
        public readonly ?string $gatewayName = null,
        public readonly ?string $paymentStatus = null,
        public readonly ?int $supplierId = null,
        public readonly ?int $categoryId = null,
        public readonly ?string $search = null,
        public readonly int $page = 1,
        public readonly int $perPage = 25,
    ) {
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            dateFrom: $data['date_from'] ?? null,
            dateTo: $data['date_to'] ?? null,
            groupBy: $data['group_by'] ?? 'day',
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : null,
            cityId: isset($data['city_id']) ? (int) $data['city_id'] : null,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            customerId: isset($data['customer_id']) ? (int) $data['customer_id'] : null,
            status: $data['status'] ?? null,
            channel: $data['channel'] ?? null,
            gatewayName: $data['gateway_name'] ?? null,
            paymentStatus: $data['payment_status'] ?? null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            categoryId: isset($data['category_id']) ? (int) $data['category_id'] : null,
            search: $data['search'] ?? null,
            page: (int) ($data['page'] ?? 1),
            perPage: min((int) ($data['per_page'] ?? 25), 100),
        );
    }

    public function toArray(): array
    {
        return [
            'date_from' => $this->dateFrom,
            'date_to' => $this->dateTo,
            'group_by' => $this->groupBy,
            'kitchen_id' => $this->kitchenId,
            'city_id' => $this->cityId,
            'meal_id' => $this->mealId,
            'meal_category_id' => $this->mealCategoryId,
            'customer_id' => $this->customerId,
            'status' => $this->status,
            'channel' => $this->channel,
            'gateway_name' => $this->gatewayName,
            'payment_status' => $this->paymentStatus,
            'supplier_id' => $this->supplierId,
            'category_id' => $this->categoryId,
            'search' => $this->search,
            'page' => $this->page,
            'per_page' => $this->perPage,
        ];
    }
}
