<?php
declare(strict_types=1);
namespace App\Events\State;
use App\Support\BaseEvent;
use App\Models\Master\State;

class StateDefaultChanged extends BaseEvent
{
    public function __construct(public readonly State $state) {}
}
