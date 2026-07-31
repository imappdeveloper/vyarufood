<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\MenuTemplate;
use Illuminate\Support\Facades\Log;

class MenuTemplateObserver
{
    public function created(MenuTemplate $template): void
    {
        Log::info('[MenuTemplate] Created: ' . $template->id, [
            'module' => 'menu_template',
            'data' => $template->toArray(),
        ]);
    }

    public function updated(MenuTemplate $template): void
    {
        Log::info('[MenuTemplate] Updated: ' . $template->id, [
            'module' => 'menu_template',
            'data' => $template->toArray(),
        ]);
    }

    public function deleted(MenuTemplate $template): void
    {
        Log::info('[MenuTemplate] Deleted: ' . $template->id, [
            'module' => 'menu_template',
            'id' => $template->id,
        ]);
    }

    public function restored(MenuTemplate $template): void
    {
        Log::info('[MenuTemplate] Restored: ' . $template->id, [
            'module' => 'menu_template',
            'id' => $template->id,
        ]);
    }

    public function forceDeleted(MenuTemplate $template): void
    {
        Log::info('[MenuTemplate] Force Deleted: ' . $template->id, [
            'module' => 'menu_template',
            'id' => $template->id,
        ]);
    }
}
