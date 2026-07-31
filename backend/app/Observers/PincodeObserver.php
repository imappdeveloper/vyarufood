<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Master\Pincode;

class PincodeObserver
{
    public function created(Pincode $pincode): void
    {
        \Log::info('Pincode created', [
            'module' => 'pincode',
            'data' => $pincode->toArray(),
        ]);

        \Log::activity('pincode', 'created', $pincode->toArray());
    }

    public function updated(Pincode $pincode): void
    {
        \Log::info('Pincode updated', [
            'module' => 'pincode',
            'data' => $pincode->toArray(),
        ]);

        \Log::activity('pincode', 'updated', $pincode->toArray());
    }

    public function deleted(Pincode $pincode): void
    {
        \Log::info('Pincode deleted', [
            'module' => 'pincode',
            'id' => $pincode->id,
        ]);

        \Log::activity('pincode', 'deleted', ['id' => $pincode->id]);
    }

    public function restoring(Pincode $pincode): void
    {
        \Log::info('Pincode restoring', [
            'module' => 'pincode',
            'id' => $pincode->id,
        ]);

        \Log::activity('pincode', 'restoring', ['id' => $pincode->id]);
    }

    public function restored(Pincode $pincode): void
    {
        \Log::info('Pincode restored', [
            'module' => 'pincode',
            'id' => $pincode->id,
        ]);

        \Log::activity('pincode', 'restored', ['id' => $pincode->id]);
    }

    public function forceDeleted(Pincode $pincode): void
    {
        \Log::info('Pincode force deleted', [
            'module' => 'pincode',
            'id' => $pincode->id,
        ]);

        \Log::activity('pincode', 'force_deleted', ['id' => $pincode->id]);
    }
}
