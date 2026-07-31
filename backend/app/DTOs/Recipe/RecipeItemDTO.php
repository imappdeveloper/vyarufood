<?php

declare(strict_types=1);

namespace App\DTOs\Recipe;

final class RecipeItemDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $inventoryItemId = null,
        public readonly ?int $unitId = null,
        public readonly float $requiredQuantity = 0,
        public readonly float $wastagePercentage = 0,
        public readonly ?float $actualQuantity = null,
        public readonly float $cost = 0,
        public readonly int $displayOrder = 0,
        public readonly ?string $remarks = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            inventoryItemId: isset($data['inventory_item_id']) ? (int) $data['inventory_item_id'] : null,
            unitId: isset($data['unit_id']) ? (int) $data['unit_id'] : null,
            requiredQuantity: isset($data['required_quantity']) ? (float) $data['required_quantity'] : 0,
            wastagePercentage: isset($data['wastage_percentage']) ? (float) $data['wastage_percentage'] : 0,
            actualQuantity: isset($data['actual_quantity']) ? (float) $data['actual_quantity'] : null,
            cost: isset($data['cost']) ? (float) $data['cost'] : 0,
            displayOrder: isset($data['display_order']) ? (int) $data['display_order'] : 0,
            remarks: $data['remarks'] ?? null,
        );
    }
}
