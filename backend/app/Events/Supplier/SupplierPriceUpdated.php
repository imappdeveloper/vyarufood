<?php

declare(strict_types=1);

namespace App\Events\Supplier;

use App\Models\SupplierProduct;
use App\Support\BaseEvent;

class SupplierPriceUpdated extends BaseEvent
{
    public function __construct(public readonly SupplierProduct $product) {}
}
