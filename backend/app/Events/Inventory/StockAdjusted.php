<?php

declare(strict_types=1);

namespace App\Events\Inventory;

use App\Models\InventoryAdjustment;

class StockAdjusted
{
    public function __construct(
        public readonly InventoryAdjustment $model,
    ) {}
}
