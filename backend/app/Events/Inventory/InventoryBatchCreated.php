<?php

declare(strict_types=1);

namespace App\Events\Inventory;

use App\Models\InventoryBatch;

class InventoryBatchCreated
{
    public function __construct(
        public readonly InventoryBatch $model,
    ) {}
}
