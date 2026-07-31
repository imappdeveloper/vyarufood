<?php

declare(strict_types=1);

namespace App\Events\Inventory;

use App\Models\InventoryTransaction;

class StockReceiptCompleted
{
    public function __construct(
        public readonly InventoryTransaction $model,
    ) {}
}
