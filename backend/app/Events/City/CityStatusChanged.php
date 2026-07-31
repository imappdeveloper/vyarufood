<?php
declare(strict_types=1);
namespace App\Events\City;
use App\Support\BaseEvent;
use App\Models\Master\City;

class CityStatusChanged extends BaseEvent
{
    public function __construct(
        public readonly City $city,
        public readonly string $oldStatus,
        public readonly string $newStatus,
    ) {}
}
