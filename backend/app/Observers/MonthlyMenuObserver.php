<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\MonthlyMenu;
use Illuminate\Support\Facades\Log;

class MonthlyMenuObserver
{
    public function created(MonthlyMenu $menu): void
    {
        Log::info('[MonthlyMenu] Created: ' . $menu->id, [
            'module' => 'monthly_menu',
            'data' => $menu->toArray(),
        ]);
    }

    public function updated(MonthlyMenu $menu): void
    {
        Log::info('[MonthlyMenu] Updated: ' . $menu->id, [
            'module' => 'monthly_menu',
            'data' => $menu->toArray(),
        ]);
    }

    public function deleted(MonthlyMenu $menu): void
    {
        Log::info('[MonthlyMenu] Deleted: ' . $menu->id, [
            'module' => 'monthly_menu',
            'id' => $menu->id,
        ]);
    }

    public function restored(MonthlyMenu $menu): void
    {
        Log::info('[MonthlyMenu] Restored: ' . $menu->id, [
            'module' => 'monthly_menu',
            'id' => $menu->id,
        ]);
    }

    public function forceDeleted(MonthlyMenu $menu): void
    {
        Log::info('[MonthlyMenu] Force Deleted: ' . $menu->id, [
            'module' => 'monthly_menu',
            'id' => $menu->id,
        ]);
    }
}
