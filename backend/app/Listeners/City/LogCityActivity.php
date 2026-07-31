<?php
declare(strict_types=1);
namespace App\Listeners\City;
use App\Support\BaseListener;
use App\Events\City\CityCreated;
use App\Events\City\CityUpdated;
use App\Events\City\CityDeleted;
use App\Events\City\CityRestored;
use App\Events\City\CityStatusChanged;
use App\Events\City\CityDefaultChanged;

class LogCityActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match(true) {
            $event instanceof CityCreated => "City '{$event->city->name}' created",
            $event instanceof CityUpdated => "City '{$event->city->name}' updated",
            $event instanceof CityDeleted => "City '{$event->city->name}' deleted",
            $event instanceof CityRestored => "City '{$event->city->name}' restored",
            $event instanceof CityStatusChanged => "City '{$event->city->name}' status changed from {$event->oldStatus} to {$event->newStatus}",
            $event instanceof CityDefaultChanged => "City '{$event->city->name}' set as default",
            default => 'City event',
        };
        activity('city')->performedOn($event->city ?? null)->event(class_basename($event))->log($description);
    }
}
