<?php
declare(strict_types=1);
namespace App\Observers;
use App\Support\BaseObserver;
use App\Models\Master\Country;
use App\Support\CacheManager;

class CountryObserver extends BaseObserver
{
    public function created(Country $country): void
    {
        CacheManager::flush('country');
        activity('country')->performedOn($country)->event('created')->log("Country '{$country->name}' created");
    }

    public function updated(Country $country): void
    {
        CacheManager::flush('country');
        $changes = $country->getChanges();
        unset($changes['updated_at']);
        if (isset($changes['status'])) {
            activity('country')->performedOn($country)->event('status_changed')
                ->log("Country '{$country->name}' status changed to {$country->status}");
        }
        if (isset($changes['is_default']) && $country->is_default) {
            activity('country')->performedOn($country)->event('default_changed')
                ->log("Country '{$country->name}' set as default");
        }
        activity('country')->performedOn($country)->event('updated')
            ->withProperties(['old' => $country->getOriginal(), 'attributes' => $changes])->log("Country '{$country->name}' updated");
    }

    public function deleted(Country $country): void
    {
        CacheManager::flush('country');
        activity('country')->performedOn($country)->event('deleted')->log("Country '{$country->name}' deleted");
    }

    public function restored(Country $country): void
    {
        CacheManager::flush('country');
        activity('country')->performedOn($country)->event('restored')->log("Country '{$country->name}' restored");
    }

    public function forceDeleted(Country $country): void
    {
        CacheManager::flush('country');
        activity('country')->performedOn($country)->event('force_deleted')->log("Country '{$country->name}' permanently deleted");
    }
}
