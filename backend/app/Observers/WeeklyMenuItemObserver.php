<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\WeeklyMenuItem;
use Illuminate\Support\Facades\Log;

class WeeklyMenuItemObserver
{
    public function created(WeeklyMenuItem $item): void
    {
        Log::info('[WeeklyMenuItem] Created: ' . $item->id, [
            'module' => 'weekly_menu_item',
            'data' => $item->toArray(),
        ]);
    }

    public function updated(WeeklyMenuItem $item): void
    {
        Log::info('[WeeklyMenuItem] Updated: ' . $item->id, [
            'module' => 'weekly_menu_item',
            'data' => $item->toArray(),
        ]);
    }

    public function deleted(WeeklyMenuItem $item): void
    {
        Log::info('[WeeklyMenuItem] Deleted: ' . $item->id, [
            'module' => 'weekly_menu_item',
            'id' => $item->id,
        ]);
    }

    public function restored(WeeklyMenuItem $item): void
    {
        Log::info('[WeeklyMenuItem] Restored: ' . $item->id, [
            'module' => 'weekly_menu_item',
            'id' => $item->id,
        ]);
    }

    public function forceDeleted(WeeklyMenuItem $item): void
    {
        Log::info('[WeeklyMenuItem] Force Deleted: ' . $item->id, [
            'module' => 'weekly_menu_item',
            'id' => $item->id,
        ]);
    }
}
