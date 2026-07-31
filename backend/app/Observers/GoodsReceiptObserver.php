<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\GoodsReceipt;
use App\Events\Purchase\GoodsReceiptCreated;

class GoodsReceiptObserver
{
    public function created(GoodsReceipt $model): void
    {
        GoodsReceiptCreated::dispatch($model);
    }
}
