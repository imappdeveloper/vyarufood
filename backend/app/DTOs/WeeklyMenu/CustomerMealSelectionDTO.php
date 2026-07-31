<?php

declare(strict_types=1);

namespace App\DTOs\WeeklyMenu;

final class CustomerMealSelectionDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?int $customerId = null,
        public readonly ?int $subscriptionId = null,
        public readonly ?int $weeklyMenuItemId = null,
        public readonly ?int $weeklyMenuId = null,
        public readonly ?string $menuDate = null,
        public readonly ?int $mealId = null,
        public readonly ?int $mealCategoryId = null,
        public readonly string $selectionStatus = 'selected',
        public readonly ?string $selectedAt = null,
        public readonly ?string $remarks = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            customerId: isset($data['customer_id']) ? (int) $data['customer_id'] : null,
            subscriptionId: isset($data['subscription_id']) ? (int) $data['subscription_id'] : null,
            weeklyMenuItemId: isset($data['weekly_menu_item_id']) ? (int) $data['weekly_menu_item_id'] : null,
            weeklyMenuId: isset($data['weekly_menu_id']) ? (int) $data['weekly_menu_id'] : null,
            menuDate: $data['menu_date'] ?? null,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            selectionStatus: $data['selection_status'] ?? 'selected',
            selectedAt: $data['selected_at'] ?? null,
            remarks: $data['remarks'] ?? null,
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            customerId: $model->customer_id,
            subscriptionId: $model->subscription_id,
            weeklyMenuItemId: $model->weekly_menu_item_id,
            weeklyMenuId: $model->weekly_menu_id,
            menuDate: $model->menu_date?->format('Y-m-d'),
            mealId: $model->meal_id,
            mealCategoryId: $model->meal_category_id,
            selectionStatus: $model->selection_status,
            selectedAt: $model->selected_at?->format('Y-m-d H:i:s'),
            remarks: $model->remarks,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'customer_id' => $this->customerId,
            'subscription_id' => $this->subscriptionId,
            'weekly_menu_item_id' => $this->weeklyMenuItemId,
            'weekly_menu_id' => $this->weeklyMenuId,
            'menu_date' => $this->menuDate,
            'meal_id' => $this->mealId,
            'meal_category_id' => $this->mealCategoryId,
            'selection_status' => $this->selectionStatus,
            'selected_at' => $this->selectedAt,
            'remarks' => $this->remarks,
        ];
    }
}
