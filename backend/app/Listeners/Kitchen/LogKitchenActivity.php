<?php
declare(strict_types=1);
namespace App\Listeners\Kitchen;
use Illuminate\Support\Facades\Log;
class LogKitchenActivity {
    public function handle(object $event): void {
        $kitchen = $event->kitchen ?? null;
        $action = class_basename($event);
        Log::info("Kitchen activity: {$action}", [
            'kitchen_id' => $kitchen?->id,
            'kitchen_code' => $kitchen?->kitchen_code,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
