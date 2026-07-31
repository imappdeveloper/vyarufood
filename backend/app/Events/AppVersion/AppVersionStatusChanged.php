<?php

declare(strict_types=1);

namespace App\Events\AppVersion;

use App\Models\AppVersion;
use App\Support\BaseEvent;

class AppVersionStatusChanged extends BaseEvent
{
    public function __construct(
        public readonly AppVersion $version,
        public readonly string $oldStatus,
        public readonly string $newStatus,
    ) {}
}
