<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Customer;

class CustomerObserver
{
    public function created(Customer $customer): void
    {
        \Log::info('Customer created', [
            'module' => 'customer',
            'data' => $customer->toArray(),
        ]);

        \Log::activity('customer', 'created', $customer->toArray());
    }

    public function updated(Customer $customer): void
    {
        \Log::info('Customer updated', [
            'module' => 'customer',
            'data' => $customer->toArray(),
        ]);

        \Log::activity('customer', 'updated', $customer->toArray());
    }

    public function deleted(Customer $customer): void
    {
        \Log::info('Customer deleted', [
            'module' => 'customer',
            'id' => $customer->id,
        ]);

        \Log::activity('customer', 'deleted', ['id' => $customer->id]);
    }

    public function restoring(Customer $customer): void
    {
        \Log::info('Customer restoring', [
            'module' => 'customer',
            'id' => $customer->id,
        ]);

        \Log::activity('customer', 'restoring', ['id' => $customer->id]);
    }

    public function restored(Customer $customer): void
    {
        \Log::info('Customer restored', [
            'module' => 'customer',
            'id' => $customer->id,
        ]);

        \Log::activity('customer', 'restored', ['id' => $customer->id]);
    }

    public function forceDeleted(Customer $customer): void
    {
        \Log::info('Customer force deleted', [
            'module' => 'customer',
            'id' => $customer->id,
        ]);

        \Log::activity('customer', 'force_deleted', ['id' => $customer->id]);
    }
}
