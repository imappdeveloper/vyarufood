<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

abstract class BaseEvent
{
    use Dispatchable, SerializesModels;

    public function __construct()
    {
        //
    }
}
