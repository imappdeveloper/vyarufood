<?php
declare(strict_types=1);
namespace App\Observers;
use App\Support\BaseObserver;
use App\Models\Master\City;
use App\Support\CacheManager;

class CityObserver extends BaseObserver
{
    public function created(City $city): void
    {
        CacheManager::flush('city');
        activity('city')->performedOn($city)->event('created')->log("City '{$city->name}' created");
    }

    public function updated(City $city): void
    {
        CacheManager::flush('city');
        $changes = $city->getChanges();
        unset($changes['updated_at']);
        if (isset($changes['status'])) {
            activity('city')->performedOn($city)->event('status_changed')
                ->log("City '{$city->name}' status changed to {$city->status}");
        }
        if (isset($changes['is_default']) && $city->is_default) {
            activity('city')->performedOn($city)->event('default_changed')
                ->log("City '{$city->name}' set as default");
        }
        activity('city')->performedOn($city)->event('updated')
            ->withProperties(['old' => $city->getOriginal(), 'attributes' => $changes])->log("City '{$city->name}' updated");
    }

    public function deleted(City $city): void
    {
        CacheManager::flush('city');
        activity('city')->performedOn($city)->event('deleted')->log("City '{$city->name}' deleted");
    }

    public function restored(City $city): void
    {
        CacheManager::flush('city');
        activity('city')->performedOn($city)->event('restored')->log("City '{$city->name}' restored");
    }

    public function forceDeleted(City $city): void
    {
        CacheManager::flush('city');
        activity('city')->performedOn($city)->event('force_deleted')->log("City '{$city->name}' permanently deleted");
    }
}
