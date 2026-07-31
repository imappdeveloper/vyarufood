<?php
declare(strict_types=1);
namespace App\Listeners\Pincode;
use Illuminate\Support\Facades\Log;
class LogPincodeActivity {
    public function handle(object $event): void {
        $pincode = $event->pincode ?? null;
        $action = class_basename($event);
        Log::info("Pincode activity: {$action}", [
            'pincode_id' => $pincode?->id,
            'pincode_name' => $pincode?->name,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
