<?php

declare(strict_types=1);

namespace App\Events\Purchase;

use App\Models\GoodsReceipt;

class GoodsReceiptRejected
{
    public function __construct(
        public readonly GoodsReceipt $model,
    ) {}
}
