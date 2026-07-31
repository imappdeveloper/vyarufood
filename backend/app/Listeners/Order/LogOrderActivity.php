<?php

declare(strict_types=1);

namespace App\Listeners\Order;

use Illuminate\Support\Facades\Log;

class LogOrderActivity
{
    public function handle(object $event): void
    {
        $order = $event->order ?? null;
        $action = class_basename($event);

        Log::info("Order activity: {$action}", [
            'order_id' => $order?->id,
            'order_number' => $order?->order_number,
            'user_id' => auth()->guard('admin')->id(),
        ]);
    }
}
