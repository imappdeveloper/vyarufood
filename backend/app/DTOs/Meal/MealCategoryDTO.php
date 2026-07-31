<?php

declare(strict_types=1);

namespace App\DTOs\Meal;

final class MealCategoryDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $categoryCode = null,
        public readonly ?string $name = null,
        public readonly ?string $slug = null,
        public readonly ?string $description = null,
        public readonly int $displayOrder = 0,
        public readonly ?string $icon = null,
        public readonly ?string $image = null,
        public readonly ?string $colorCode = null,
        public readonly ?string $status = 'active',
        public readonly bool $isDefault = false,
        public readonly ?string $remarks = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
        public readonly ?int $deletedBy = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            categoryCode: $data['category_code'] ?? null,
            name: $data['name'] ?? null,
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? null,
            displayOrder: isset($data['display_order']) ? (int) $data['display_order'] : 0,
            icon: $data['icon'] ?? null,
            image: $data['image'] ?? null,
            colorCode: $data['color_code'] ?? null,
            status: $data['status'] ?? 'active',
            isDefault: (bool) ($data['is_default'] ?? false),
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            deletedBy: isset($data['deleted_by']) ? (int) $data['deleted_by'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'category_code' => $this->categoryCode,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'display_order' => $this->displayOrder,
            'icon' => $this->icon,
            'image' => $this->image,
            'color_code' => $this->colorCode,
            'status' => $this->status,
            'is_default' => $this->isDefault,
            'remarks' => $this->remarks,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
