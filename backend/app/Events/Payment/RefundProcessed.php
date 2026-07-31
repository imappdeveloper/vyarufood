<?php

declare(strict_types=1);

namespace App\Events\Payment;

use App\Models\PaymentRefund;
use Illuminate\Foundation\Events\Dispatchable;

class RefundProcessed
{
    use Dispatchable;

    public function __construct(public PaymentRefund $paymentRefund) {}
}
