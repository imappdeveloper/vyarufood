<?php

declare(strict_types=1);

namespace App\Events\SystemSetting;

use App\Models\SystemSetting;
use App\Support\BaseEvent;

class SystemSettingUpdated extends BaseEvent
{
    public function __construct(public readonly SystemSetting $setting) {}
}
