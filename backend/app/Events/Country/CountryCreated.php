<?php
declare(strict_types=1);
namespace App\Events\Country;
use App\Support\BaseEvent;
use App\Models\Master\Country;

class CountryCreated extends BaseEvent
{
    public function __construct(public readonly Country $country) {}
}
