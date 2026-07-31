<?php

declare(strict_types=1);

namespace App\Events\Inventory;

use App\Models\InventoryTransaction;

class StockConsumed
{
    public function __construct(
        public readonly InventoryTransaction $model,
    ) {}
}
