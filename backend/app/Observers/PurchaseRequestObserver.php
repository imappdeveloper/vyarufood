<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\PurchaseRequest;
use App\Events\Purchase\{PurchaseRequestCreated, PurchaseRequestUpdated};

class PurchaseRequestObserver
{
    public function created(PurchaseRequest $model): void
    {
        PurchaseRequestCreated::dispatch($model);
    }

    public function updated(PurchaseRequest $model): void
    {
        PurchaseRequestUpdated::dispatch($model);
    }

    public function deleted(PurchaseRequest $model): void
    {
        // No event for soft delete
    }

    public function restored(PurchaseRequest $model): void
    {
        // No event for restore
    }
}
