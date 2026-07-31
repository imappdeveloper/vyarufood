<?php

declare(strict_types=1);

namespace App\Events\Payment;

use App\Models\PaymentTransaction;
use Illuminate\Foundation\Events\Dispatchable;

class PaymentCreated
{
    use Dispatchable;

    public function __construct(public PaymentTransaction $paymentTransaction) {}
}
