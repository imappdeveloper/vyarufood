<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\PurchaseOrder;
use App\Events\Purchase\{PurchaseOrderCreated, PurchaseOrderUpdated};

class PurchaseOrderObserver
{
    public function created(PurchaseOrder $model): void
    {
        PurchaseOrderCreated::dispatch($model);
    }

    public function updated(PurchaseOrder $model): void
    {
        PurchaseOrderUpdated::dispatch($model);
    }

    public function deleted(PurchaseOrder $model): void
    {
        // No event for soft delete
    }

    public function restored(PurchaseOrder $model): void
    {
        // No event for restore
    }
}
