<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\InventoryItem;
use App\Events\Inventory\InventoryItemCreated;
use App\Events\Inventory\InventoryItemUpdated;

class InventoryItemObserver
{
    public function created(InventoryItem $model): void
    {
        InventoryItemCreated::dispatch($model);
    }

    public function updated(InventoryItem $model): void
    {
        InventoryItemUpdated::dispatch($model);
    }

    public function deleted(InventoryItem $model): void {}
    public function restored(InventoryItem $model): void {}
}
