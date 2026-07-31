<?php
declare(strict_types=1);
namespace App\Listeners\WeeklyMenu;
use Illuminate\Support\Facades\Log;
final class LogWeeklyMenuActivity
{
    public function handle(object $event): void
    {
        $action = class_basename($event);
        $model = $event->menu ?? $event->item ?? $event->selection ?? null;
        Log::info("[WeeklyMenu] {$action}", [
            'model_id' => $model?->id,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
