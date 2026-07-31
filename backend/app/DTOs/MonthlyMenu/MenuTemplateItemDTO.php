<?php

declare(strict_types=1);

namespace App\DTOs\MonthlyMenu;

final class MenuTemplateItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $menuTemplateId = 0,
        public readonly ?string $dayName = null,
        public readonly int $mealCategoryId = 0,
        public readonly int $mealId = 0,
        public readonly ?int $mealTypeId = null,
        public readonly int $displayOrder = 0,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            menuTemplateId: isset($data['menu_template_id']) ? (int) $data['menu_template_id'] : 0,
            dayName: $data['day_name'] ?? null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : 0,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : 0,
            mealTypeId: isset($data['meal_type_id']) ? (int) $data['meal_type_id'] : null,
            displayOrder: isset($data['display_order']) ? (int) $data['display_order'] : 0,
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            menuTemplateId: $model->menu_template_id,
            dayName: $model->day_name,
            mealCategoryId: $model->meal_category_id,
            mealId: $model->meal_id,
            mealTypeId: $model->meal_type_id,
            displayOrder: $model->display_order,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'menu_template_id' => $this->menuTemplateId,
            'day_name' => $this->dayName,
            'meal_category_id' => $this->mealCategoryId,
            'meal_id' => $this->mealId,
            'meal_type_id' => $this->mealTypeId,
            'display_order' => $this->displayOrder,
        ];
    }
}
