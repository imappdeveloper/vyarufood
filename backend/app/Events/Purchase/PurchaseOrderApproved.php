<?php

declare(strict_types=1);

namespace App\Events\Purchase;

use App\Models\PurchaseOrder;

class PurchaseOrderApproved
{
    public function __construct(
        public readonly PurchaseOrder $model,
    ) {}
}
