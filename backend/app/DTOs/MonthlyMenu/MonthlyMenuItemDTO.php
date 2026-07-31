<?php

declare(strict_types=1);

namespace App\DTOs\MonthlyMenu;

final class MonthlyMenuItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $monthlyMenuId = 0,
        public readonly ?string $menuDate = null,
        public readonly ?string $dayName = null,
        public readonly int $mealCategoryId = 0,
        public readonly int $mealId = 0,
        public readonly ?int $mealTypeId = null,
        public readonly int $displayOrder = 0,
        public readonly int $mealLimit = 50,
        public readonly int $remainingQuantity = 50,
        public readonly bool $isDefault = false,
        public readonly bool $isOptional = false,
        public readonly bool $isSpecial = false,
        public readonly bool $isFestival = false,
        public readonly string $status = 'active',
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            monthlyMenuId: isset($data['monthly_menu_id']) ? (int) $data['monthly_menu_id'] : 0,
            menuDate: $data['menu_date'] ?? null,
            dayName: $data['day_name'] ?? null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : 0,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : 0,
            mealTypeId: isset($data['meal_type_id']) ? (int) $data['meal_type_id'] : null,
            displayOrder: isset($data['display_order']) ? (int) $data['display_order'] : 0,
            mealLimit: isset($data['meal_limit']) ? (int) $data['meal_limit'] : 50,
            remainingQuantity: isset($data['remaining_quantity']) ? (int) $data['remaining_quantity'] : 50,
            isDefault: ($data['is_default'] ?? false) === true || ($data['is_default'] ?? 0) == 1,
            isOptional: ($data['is_optional'] ?? false) === true || ($data['is_optional'] ?? 0) == 1,
            isSpecial: ($data['is_special'] ?? false) === true || ($data['is_special'] ?? 0) == 1,
            isFestival: ($data['is_festival'] ?? false) === true || ($data['is_festival'] ?? 0) == 1,
            status: $data['status'] ?? 'active',
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            monthlyMenuId: $model->monthly_menu_id,
            menuDate: $model->menu_date?->format('Y-m-d'),
            dayName: $model->day_name,
            mealCategoryId: $model->meal_category_id,
            mealId: $model->meal_id,
            mealTypeId: $model->meal_type_id,
            displayOrder: $model->display_order,
            mealLimit: $model->meal_limit,
            remainingQuantity: $model->remaining_quantity,
            isDefault: $model->is_default,
            isOptional: $model->is_optional,
            isSpecial: $model->is_special,
            isFestival: $model->is_festival,
            status: $model->status,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'monthly_menu_id' => $this->monthlyMenuId,
            'menu_date' => $this->menuDate,
            'day_name' => $this->dayName,
            'meal_category_id' => $this->mealCategoryId,
            'meal_id' => $this->mealId,
            'meal_type_id' => $this->mealTypeId,
            'display_order' => $this->displayOrder,
            'meal_limit' => $this->mealLimit,
            'remaining_quantity' => $this->remainingQuantity,
            'is_default' => $this->isDefault,
            'is_optional' => $this->isOptional,
            'is_special' => $this->isSpecial,
            'is_festival' => $this->isFestival,
            'status' => $this->status,
        ];
    }
}
