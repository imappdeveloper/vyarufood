<?php

declare(strict_types=1);

namespace App\Repositories\Order;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;

interface OrderItemRepositoryInterface
{
    public function getByOrderId(int $orderId): Collection;
    public function create(array $data): OrderItem;
    public function createMultiple(int $orderId, array $items): Collection;
    public function deleteByOrderId(int $orderId): bool;
}
