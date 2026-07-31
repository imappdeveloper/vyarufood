<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\WeeklyMenu;
use Illuminate\Support\Facades\Log;

class WeeklyMenuObserver
{
    public function created(WeeklyMenu $menu): void
    {
        Log::info('[WeeklyMenu] Created: ' . $menu->id, [
            'module' => 'weekly_menu',
            'data' => $menu->toArray(),
        ]);
    }

    public function updated(WeeklyMenu $menu): void
    {
        Log::info('[WeeklyMenu] Updated: ' . $menu->id, [
            'module' => 'weekly_menu',
            'data' => $menu->toArray(),
        ]);
    }

    public function deleted(WeeklyMenu $menu): void
    {
        Log::info('[WeeklyMenu] Deleted: ' . $menu->id, [
            'module' => 'weekly_menu',
            'id' => $menu->id,
        ]);
    }

    public function restored(WeeklyMenu $menu): void
    {
        Log::info('[WeeklyMenu] Restored: ' . $menu->id, [
            'module' => 'weekly_menu',
            'id' => $menu->id,
        ]);
    }

    public function forceDeleted(WeeklyMenu $menu): void
    {
        Log::info('[WeeklyMenu] Force Deleted: ' . $menu->id, [
            'module' => 'weekly_menu',
            'id' => $menu->id,
        ]);
    }
}
