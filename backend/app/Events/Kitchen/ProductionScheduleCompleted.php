<?php

declare(strict_types=1);

namespace App\Events\Kitchen;

use App\Models\ProductionSchedule;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductionScheduleCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly ProductionSchedule $schedule,
    ) {}
}
