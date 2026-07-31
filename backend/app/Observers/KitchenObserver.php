<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Kitchen;

class KitchenObserver
{
    public function created(Kitchen $kitchen): void
    {
        \Log::info('Kitchen created', [
            'module' => 'kitchen',
            'data' => $kitchen->toArray(),
        ]);
    }

    public function updated(Kitchen $kitchen): void
    {
        \Log::info('Kitchen updated', [
            'module' => 'kitchen',
            'data' => $kitchen->toArray(),
        ]);
    }

    public function deleted(Kitchen $kitchen): void
    {
        \Log::info('Kitchen deleted', [
            'module' => 'kitchen',
            'id' => $kitchen->id,
        ]);
    }

    public function restoring(Kitchen $kitchen): void
    {
        \Log::info('Kitchen restoring', [
            'module' => 'kitchen',
            'id' => $kitchen->id,
        ]);
    }

    public function restored(Kitchen $kitchen): void
    {
        \Log::info('Kitchen restored', [
            'module' => 'kitchen',
            'id' => $kitchen->id,
        ]);
    }

    public function forceDeleted(Kitchen $kitchen): void
    {
        \Log::info('Kitchen force deleted', [
            'module' => 'kitchen',
            'id' => $kitchen->id,
        ]);
    }
}
