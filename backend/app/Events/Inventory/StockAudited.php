<?php

declare(strict_types=1);

namespace App\Events\Inventory;

use App\Models\StockAudit;

class StockAudited
{
    public function __construct(
        public readonly StockAudit $model,
    ) {}
}
