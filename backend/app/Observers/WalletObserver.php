<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Wallet;
use App\Events\Payment\WalletCreated;
use App\Events\Payment\WalletUpdated;

class WalletObserver
{
    public function created(Wallet $wallet): void
    {
        event(new WalletCreated($wallet));
    }

    public function updated(Wallet $wallet): void
    {
        event(new WalletUpdated($wallet));
    }
}
