<?php
declare(strict_types=1);
namespace App\Listeners\CustomerAddress;
use Illuminate\Support\Facades\Log;
class LogCustomerAddressActivity {
    public function handle(object $event): void {
        $address = $event->address ?? null;
        $action = class_basename($event);
        Log::info("CustomerAddress activity: {$action}", [
            'address_id' => $address?->id,
            'customer_id' => $address?->customer_id,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
