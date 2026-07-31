<?php

declare(strict_types=1);

namespace App\Events\Supplier;

use App\Models\Supplier;
use App\Support\BaseEvent;

class SupplierRestored extends BaseEvent
{
    public function __construct(public readonly Supplier $supplier) {}
}
