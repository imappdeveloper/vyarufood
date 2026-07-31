<?php

declare(strict_types=1);

namespace App\Events\Finance;

use App\Models\ChartOfAccount;
use Illuminate\Foundation\Events\Dispatchable;

class ChartOfAccountDeleted
{
    use Dispatchable;

    public function __construct(public ChartOfAccount $account) {}
}
