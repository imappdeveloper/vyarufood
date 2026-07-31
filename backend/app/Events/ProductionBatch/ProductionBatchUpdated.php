<?php

declare(strict_types=1);

namespace App\Events\ProductionBatch;

use App\Models\ProductionBatch;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductionBatchUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(public ProductionBatch $batch) {}
}
