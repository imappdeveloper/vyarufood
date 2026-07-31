<?php

declare(strict_types=1);

namespace App\Listeners\SystemSetting;

use App\Events\SystemSetting\SystemSettingUpdated;
use App\Support\BaseListener;

class LogSystemSettingActivity extends BaseListener
{
    public function handle(object $event): void
    {
        if ($event instanceof SystemSettingUpdated) {
            activity('system_setting')
                ->performedOn($event->setting)
                ->event('updated')
                ->log("System setting '{$event->setting->setting_key}' updated");
        }
    }
}
