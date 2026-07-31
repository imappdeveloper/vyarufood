<?php

declare(strict_types=1);

namespace App\DTOs\SubscriptionPlan;

final class SubscriptionPlanMealDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?int $subscriptionPlanId = null,
        public readonly ?int $mealCategoryId = null,
        public readonly ?int $mealTypeId = null,
        public readonly ?int $mealId = null,
        public readonly ?string $dayOfWeek = null,
        public readonly int $quantity = 1,
        public readonly bool $isOptional = false,
        public readonly bool $isDefault = true,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            subscriptionPlanId: isset($data['subscription_plan_id']) ? (int) $data['subscription_plan_id'] : null,
            mealCategoryId: isset($data['meal_category_id']) ? (int) $data['meal_category_id'] : null,
            mealTypeId: isset($data['meal_type_id']) ? (int) $data['meal_type_id'] : null,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            dayOfWeek: $data['day_of_week'] ?? null,
            quantity: isset($data['quantity']) ? (int) $data['quantity'] : 1,
            isOptional: (bool) ($data['is_optional'] ?? false),
            isDefault: (bool) ($data['is_default'] ?? true),
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            subscriptionPlanId: $model->subscription_plan_id,
            mealCategoryId: $model->meal_category_id,
            mealTypeId: $model->meal_type_id,
            mealId: $model->meal_id,
            dayOfWeek: $model->day_of_week,
            quantity: $model->quantity,
            isOptional: $model->is_optional,
            isDefault: $model->is_default,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'subscription_plan_id' => $this->subscriptionPlanId,
            'meal_category_id' => $this->mealCategoryId,
            'meal_type_id' => $this->mealTypeId,
            'meal_id' => $this->mealId,
            'day_of_week' => $this->dayOfWeek,
            'quantity' => $this->quantity,
            'is_optional' => $this->isOptional,
            'is_default' => $this->isDefault,
        ];
    }
}
