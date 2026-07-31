<?php

declare(strict_types=1);

namespace App\Observers;

use App\Events\Order\OrderCreated;
use App\Events\Order\OrderDeleted;
use App\Events\Order\OrderStatusChanged;
use App\Events\Order\OrderUpdated;
use App\Models\Order;

class OrderObserver
{
    public function created(Order $order): void
    {
        OrderCreated::dispatch($order);
    }

    public function updated(Order $order): void
    {
        OrderUpdated::dispatch($order);

        if ($order->isDirty('order_status')) {
            OrderStatusChanged::dispatch(
                $order,
                $order->getOriginal('order_status'),
                $order->order_status,
            );
        }
    }

    public function deleted(Order $order): void
    {
        OrderDeleted::dispatch($order);
    }
}
