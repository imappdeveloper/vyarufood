<?php

declare(strict_types=1);

namespace App\Events\Recipe;

use App\Models\ProductionBatch;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InventoryConsumed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public ProductionBatch $batch,
        public array $consumptionLogs,
    ) {}
}
