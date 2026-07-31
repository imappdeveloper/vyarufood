<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Master\Area;
use App\Events\Area\AreaCreated;
use App\Events\Area\AreaUpdated;
use App\Events\Area\AreaDeleted;
use App\Events\Area\AreaRestored;
use App\Events\Area\AreaStatusChanged;
use App\Events\Area\AreaDefaultChanged;

class AreaObserver
{
    public function created(Area $area): void
    {
        event(new AreaCreated($area));
    }

    public function updated(Area $area): void
    {
        if ($area->wasChanged('status')) {
            event(new AreaStatusChanged($area, $area->getOriginal('status'), $area->status));
        }

        if ($area->wasChanged('is_default')) {
            event(new AreaDefaultChanged($area));
        }

        event(new AreaUpdated($area));
    }

    public function deleted(Area $area): void
    {
        event(new AreaDeleted($area));
    }

    public function restored(Area $area): void
    {
        event(new AreaRestored($area));
    }
}
