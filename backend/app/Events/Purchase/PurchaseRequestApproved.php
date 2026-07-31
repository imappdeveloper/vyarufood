<?php

declare(strict_types=1);

namespace App\Events\Purchase;

use App\Models\PurchaseRequest;

class PurchaseRequestApproved
{
    public function __construct(
        public readonly PurchaseRequest $model,
    ) {}
}
