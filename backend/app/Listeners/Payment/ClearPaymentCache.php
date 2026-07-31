<?php

declare(strict_types=1);

namespace App\Listeners\Payment;

use App\Events\Payment\PaymentCreated;
use App\Events\Payment\PaymentUpdated;
use App\Events\Payment\PaymentSuccessful;
use App\Events\Payment\PaymentFailed;
use App\Events\Payment\WalletRecharged;
use App\Events\Payment\RefundProcessed;
use App\Events\Payment\WalletCreated;
use App\Events\Payment\WalletUpdated;
use App\Support\CacheManager;

class ClearPaymentCache
{
    public function handle(
        PaymentCreated|PaymentUpdated|PaymentSuccessful|PaymentFailed|WalletRecharged|RefundProcessed|WalletCreated|WalletUpdated $event,
    ): void {
        CacheManager::flush('payment');
    }
}
