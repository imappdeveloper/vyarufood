<?php

declare(strict_types=1);

namespace App\Events\Finance;

use App\Models\FinancialYear;
use Illuminate\Foundation\Events\Dispatchable;

class FinancialYearClosed
{
    use Dispatchable;

    public function __construct(public FinancialYear $financialYear) {}
}
