<?php
declare(strict_types=1);
namespace App\Listeners\Area;
use Illuminate\Support\Facades\Log;
class LogAreaActivity {
    public function handle(object $event): void {
        $area = $event->area ?? null;
        $action = class_basename($event);
        Log::info("Area activity: {$action}", [
            'area_id' => $area?->id,
            'area_name' => $area?->name,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
