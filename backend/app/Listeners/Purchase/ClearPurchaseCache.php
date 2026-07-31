<?php

declare(strict_types=1);

namespace App\Listeners\Purchase;

use App\Events\Purchase\{PurchaseRequestCreated, PurchaseRequestApproved, PurchaseRequestRejected, PurchaseRequestUpdated, PurchaseOrderCreated, PurchaseOrderApproved, GoodsReceiptCreated, GoodsReceiptRejected};
use App\Support\CacheManager;

class ClearPurchaseCache
{
    public function handle(mixed $event): void
    {
        CacheManager::flush('purchase');
    }
}
