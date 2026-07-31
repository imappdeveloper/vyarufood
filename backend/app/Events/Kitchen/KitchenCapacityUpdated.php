<?php

declare(strict_types=1);

namespace App\Events\Kitchen;

use App\Models\KitchenCapacity;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KitchenCapacityUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly KitchenCapacity $capacity,
        public readonly array $changes,
    ) {}
}
