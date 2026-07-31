<?php

declare(strict_types=1);

namespace App\Events\Inventory;

use App\Models\InventoryItem;

class LowStockTriggered
{
    public function __construct(
        public readonly InventoryItem $model,
    ) {}
}
