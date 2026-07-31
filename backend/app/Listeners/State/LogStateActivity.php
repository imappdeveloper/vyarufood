<?php
declare(strict_types=1);
namespace App\Listeners\State;
use App\Support\BaseListener;
use App\Events\State\StateCreated;
use App\Events\State\StateUpdated;
use App\Events\State\StateDeleted;
use App\Events\State\StateRestored;
use App\Events\State\StateStatusChanged;
use App\Events\State\StateDefaultChanged;

class LogStateActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match(true) {
            $event instanceof StateCreated => "State '{$event->state->name}' created",
            $event instanceof StateUpdated => "State '{$event->state->name}' updated",
            $event instanceof StateDeleted => "State '{$event->state->name}' deleted",
            $event instanceof StateRestored => "State '{$event->state->name}' restored",
            $event instanceof StateStatusChanged => "State '{$event->state->name}' status changed from {$event->oldStatus} to {$event->newStatus}",
            $event instanceof StateDefaultChanged => "State '{$event->state->name}' set as default",
            default => 'State event',
        };
        activity('state')->performedOn($event->state ?? null)->event(class_basename($event))->log($description);
    }
}
