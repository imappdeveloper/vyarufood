<?php

declare(strict_types=1);

namespace App\Events\Kitchen;

use App\Models\KitchenWorkingDay;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KitchenWorkingDayUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly KitchenWorkingDay $workingDay,
        public readonly array $changes,
    ) {}
}
