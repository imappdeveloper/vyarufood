<?php

declare(strict_types=1);

namespace App\DTOs\WeeklyMenu;

final class WeeklyMenuItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?int $weeklyMenuId = null,
        public readonly ?string $menuDate = null,
        public readonly ?int $mealCategoryId = null,
        public readonly ?int $mealId = null,
        public readonly ?int $mealTypeId = null,
        public readonly int $displayOrder = 0,
        public readonly int $mealLimit = 0,
        public readonly int $remainingQuantity = 0,
        public readonly bool $isDefault = false,
        public readonly bool $isOptional = false,
        public readonly bool $isRecommended = false,
        public readonly bool $isActive = true,
        public readonly string $status = 'active',
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            weeklyMenuId: isset($data['weekly_menu_id']) ? (int) $data['weekly_menu_id'] : null,
            menuDate: $data['menu_date'] ?? null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            mealTypeId: isset($data['meal_type_id']) ? (int) $data['meal_type_id'] : null,
            displayOrder: isset($data['display_order']) ? (int) $data['display_order'] : 0,
            mealLimit: isset($data['meal_limit']) ? (int) $data['meal_limit'] : 0,
            remainingQuantity: isset($data['remaining_quantity']) ? (int) $data['remaining_quantity'] : 0,
            isDefault: (bool) ($data['is_default'] ?? false),
            isOptional: (bool) ($data['is_optional'] ?? false),
            isRecommended: (bool) ($data['is_recommended'] ?? false),
            isActive: (bool) ($data['is_active'] ?? true),
            status: $data['status'] ?? 'active',
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            weeklyMenuId: $model->weekly_menu_id,
            menuDate: $model->menu_date?->format('Y-m-d'),
            mealCategoryId: $model->meal_category_id,
            mealId: $model->meal_id,
            mealTypeId: $model->meal_type_id,
            displayOrder: $model->display_order,
            mealLimit: $model->meal_limit,
            remainingQuantity: $model->remaining_quantity,
            isDefault: $model->is_default,
            isOptional: $model->is_optional,
            isRecommended: $model->is_recommended,
            isActive: $model->is_active,
            status: $model->status,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'weekly_menu_id' => $this->weeklyMenuId,
            'menu_date' => $this->menuDate,
            'meal_category_id' => $this->mealCategoryId,
            'meal_id' => $this->mealId,
            'meal_type_id' => $this->mealTypeId,
            'display_order' => $this->displayOrder,
            'meal_limit' => $this->mealLimit,
            'remaining_quantity' => $this->remainingQuantity,
            'is_default' => $this->isDefault,
            'is_optional' => $this->isOptional,
            'is_recommended' => $this->isRecommended,
            'is_active' => $this->isActive,
            'status' => $this->status,
        ];
    }
}
