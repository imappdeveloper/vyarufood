<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\PaymentTransaction;
use App\Events\Payment\PaymentCreated;
use App\Events\Payment\PaymentUpdated;
use App\Events\Payment\PaymentSuccessful;

class PaymentTransactionObserver
{
    public function created(PaymentTransaction $paymentTransaction): void
    {
        event(new PaymentCreated($paymentTransaction));
    }

    public function updated(PaymentTransaction $paymentTransaction): void
    {
        event(new PaymentUpdated($paymentTransaction));

        if ($paymentTransaction->isDirty('status') && $paymentTransaction->status === 'success') {
            event(new PaymentSuccessful($paymentTransaction));
        }
    }
}
