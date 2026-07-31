<?php

declare(strict_types=1);

namespace App\DTOs\Expense;

final readonly class ExpenseCategoryDTO
{
    public function __construct(
        public string $categoryCode,
        public string $categoryName,
        public ?int $parentCategoryId = null,
        public ?string $icon = null,
        public ?string $color = null,
        public bool $isRecurring = false,
        public bool $isTaxable = true,
        public string $status = 'active',
        public int $displayOrder = 0,
        public ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            categoryCode: $data['category_code'] ?? '',
            categoryName: $data['category_name'] ?? '',
            parentCategoryId: isset($data['parent_category_id']) ? (int) $data['parent_category_id'] : null,
            icon: $data['icon'] ?? null,
            color: $data['color'] ?? null,
            isRecurring: (bool) ($data['is_recurring'] ?? false),
            isTaxable: (bool) ($data['is_taxable'] ?? true),
            status: $data['status'] ?? 'active',
            displayOrder: (int) ($data['display_order'] ?? 0),
            remarks: $data['remarks'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'category_code' => $this->categoryCode,
            'category_name' => $this->categoryName,
            'parent_category_id' => $this->parentCategoryId,
            'icon' => $this->icon,
            'color' => $this->color,
            'is_recurring' => $this->isRecurring,
            'is_taxable' => $this->isTaxable,
            'status' => $this->status,
            'display_order' => $this->displayOrder,
            'remarks' => $this->remarks,
        ];
    }
}
