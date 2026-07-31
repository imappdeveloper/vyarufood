<?php
declare(strict_types=1);
namespace App\Observers;
use App\Support\BaseObserver;
use App\Models\Master\State;
use App\Support\CacheManager;

class StateObserver extends BaseObserver
{
    public function created(State $state): void
    {
        CacheManager::flush('state');
        activity('state')->performedOn($state)->event('created')->log("State '{$state->name}' created");
    }

    public function updated(State $state): void
    {
        CacheManager::flush('state');
        $changes = $state->getChanges();
        unset($changes['updated_at']);
        if (isset($changes['status'])) {
            activity('state')->performedOn($state)->event('status_changed')
                ->log("State '{$state->name}' status changed to {$state->status}");
        }
        if (isset($changes['is_default']) && $state->is_default) {
            activity('state')->performedOn($state)->event('default_changed')
                ->log("State '{$state->name}' set as default");
        }
        activity('state')->performedOn($state)->event('updated')
            ->withProperties(['old' => $state->getOriginal(), 'attributes' => $changes])->log("State '{$state->name}' updated");
    }

    public function deleted(State $state): void
    {
        CacheManager::flush('state');
        activity('state')->performedOn($state)->event('deleted')->log("State '{$state->name}' deleted");
    }

    public function restored(State $state): void
    {
        CacheManager::flush('state');
        activity('state')->performedOn($state)->event('restored')->log("State '{$state->name}' restored");
    }

    public function forceDeleted(State $state): void
    {
        CacheManager::flush('state');
        activity('state')->performedOn($state)->event('force_deleted')->log("State '{$state->name}' permanently deleted");
    }
}
