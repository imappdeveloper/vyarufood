<?php

declare(strict_types=1);

namespace App\Events\Kitchen;

use App\Models\KitchenHoliday;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KitchenHolidayCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly KitchenHoliday $holiday,
    ) {}
}
