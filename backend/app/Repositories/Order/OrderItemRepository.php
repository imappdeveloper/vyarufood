<?php

declare(strict_types=1);

namespace App\Repositories\Order;

use App\Models\OrderItem;
use App\Support\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class OrderItemRepository extends BaseRepository implements OrderItemRepositoryInterface
{
    protected function model(): OrderItem
    {
        return new OrderItem;
    }

    public function getByOrderId(int $orderId): Collection
    {
        return $this->model->query()
            ->with(['meal'])
            ->where('order_id', $orderId)
            ->get();
    }

    public function create(array $data): OrderItem
    {
        return $this->model->create($data);
    }

    public function createMultiple(int $orderId, array $items): Collection
    {
        $created = collect();

        foreach ($items as $item) {
            $item['order_id'] = $orderId;
            $created->push($this->model->create($item));
        }

        return $created;
    }

    public function deleteByOrderId(int $orderId): bool
    {
        return (bool) $this->model->where('order_id', $orderId)->delete();
    }
}
