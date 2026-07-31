<?php

declare(strict_types=1);

namespace App\DTOs\Recipe;

final class RecipeDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $recipeCode = null,
        public readonly ?int $mealId = null,
        public readonly ?string $recipeName = null,
        public readonly int $version = 1,
        public readonly float $yieldQuantity = 1,
        public readonly ?string $yieldUnit = null,
        public readonly ?int $preparationTime = null,
        public readonly ?int $cookingTime = null,
        public readonly int $servingSize = 1,
        public readonly float $recipeCost = 0,
        public readonly float $foodCostPercentage = 0,
        public readonly string $status = 'draft',
        public readonly ?string $remarks = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
        public readonly array $items = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            recipeCode: $data['recipe_code'] ?? null,
            mealId: isset($data['meal_id']) ? (int) $data['meal_id'] : null,
            recipeName: $data['recipe_name'] ?? null,
            version: isset($data['version']) ? (int) $data['version'] : 1,
            yieldQuantity: isset($data['yield_quantity']) ? (float) $data['yield_quantity'] : 1,
            yieldUnit: $data['yield_unit'] ?? null,
            preparationTime: isset($data['preparation_time']) ? (int) $data['preparation_time'] : null,
            cookingTime: isset($data['cooking_time']) ? (int) $data['cooking_time'] : null,
            servingSize: isset($data['serving_size']) ? (int) $data['serving_size'] : 1,
            recipeCost: isset($data['recipe_cost']) ? (float) $data['recipe_cost'] : 0,
            foodCostPercentage: isset($data['food_cost_percentage']) ? (float) $data['food_cost_percentage'] : 0,
            status: $data['status'] ?? 'draft',
            remarks: $data['remarks'] ?? null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            items: array_map(fn (array $item) => RecipeItemDTO::fromArray($item), $data['items'] ?? []),
        );
    }
}
