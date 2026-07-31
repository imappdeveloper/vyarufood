<?php
declare(strict_types=1);
namespace App\Listeners\Country;
use App\Support\BaseListener;
use App\Events\Country\CountryCreated;
use App\Events\Country\CountryUpdated;
use App\Events\Country\CountryDeleted;
use App\Events\Country\CountryRestored;
use App\Events\Country\CountryStatusChanged;
use App\Events\Country\CountryDefaultChanged;

class LogCountryActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match(true) {
            $event instanceof CountryCreated => "Country '{$event->country->name}' created",
            $event instanceof CountryUpdated => "Country '{$event->country->name}' updated",
            $event instanceof CountryDeleted => "Country '{$event->country->name}' deleted",
            $event instanceof CountryRestored => "Country '{$event->country->name}' restored",
            $event instanceof CountryStatusChanged => "Country '{$event->country->name}' status changed from {$event->oldStatus} to {$event->newStatus}",
            $event instanceof CountryDefaultChanged => "Country '{$event->country->name}' set as default",
            default => 'Country event',
        };
        activity('country')->performedOn($event->country ?? null)->event(class_basename($event))->log($description);
    }
}
