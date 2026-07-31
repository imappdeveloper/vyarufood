<?php
declare(strict_types=1);
namespace App\Listeners\Customer;
use Illuminate\Support\Facades\Log;
class LogCustomerActivity {
    public function handle(object $event): void {
        $customer = $event->customer ?? null;
        $action = class_basename($event);
        Log::info("Customer activity: {$action}", [
            'customer_id' => $customer?->id,
            'customer_email' => $customer?->email,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
