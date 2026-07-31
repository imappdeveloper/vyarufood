<?php

declare(strict_types=1);

namespace App\Events\Payment;

use App\Models\Wallet;
use Illuminate\Foundation\Events\Dispatchable;

class WalletUpdated
{
    use Dispatchable;

    public function __construct(public Wallet $wallet) {}
}
