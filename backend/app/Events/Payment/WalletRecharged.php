<?php

declare(strict_types=1);

namespace App\Events\Payment;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Foundation\Events\Dispatchable;

class WalletRecharged
{
    use Dispatchable;

    public function __construct(
        public Wallet $wallet,
        public WalletTransaction $walletTransaction,
    ) {}
}
