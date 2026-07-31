<?php
declare(strict_types=1);
namespace App\Events\Country;
use App\Support\BaseEvent;
use App\Models\Master\Country;

class CountryStatusChanged extends BaseEvent
{
    public function __construct(
        public readonly Country $country,
        public readonly string $oldStatus,
        public readonly string $newStatus,
    ) {}
}
