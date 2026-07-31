<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\CustomerAddress;

class CustomerAddressObserver
{
    public function created(CustomerAddress $address): void
    {
        \Log::info('CustomerAddress created', [
            'module' => 'customer_address',
            'data' => $address->toArray(),
        ]);
    }

    public function updated(CustomerAddress $address): void
    {
        \Log::info('CustomerAddress updated', [
            'module' => 'customer_address',
            'data' => $address->toArray(),
        ]);
    }

    public function deleted(CustomerAddress $address): void
    {
        \Log::info('CustomerAddress deleted', [
            'module' => 'customer_address',
            'id' => $address->id,
        ]);
    }

    public function restoring(CustomerAddress $address): void
    {
        \Log::info('CustomerAddress restoring', [
            'module' => 'customer_address',
            'id' => $address->id,
        ]);
    }

    public function restored(CustomerAddress $address): void
    {
        \Log::info('CustomerAddress restored', [
            'module' => 'customer_address',
            'id' => $address->id,
        ]);
    }

    public function forceDeleted(CustomerAddress $address): void
    {
        \Log::info('CustomerAddress force deleted', [
            'module' => 'customer_address',
            'id' => $address->id,
        ]);
    }
}
