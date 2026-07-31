<?php

declare(strict_types=1);

namespace App\Repositories\Order;

use App\Models\Order;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    protected function model(): Order
    {
        return new Order;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['customer', 'subscription.subscriptionPlan', 'kitchen', 'mealCategory', 'mealType', 'meal']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'LIKE', "%{$search}%")->orWhere('email', 'LIKE', "%{$search}%"));
            });
        }

        if (! empty($filters['subscription_id'])) {
            $query->where('subscription_id', (int) $filters['subscription_id']);
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', (int) $filters['customer_id']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', (int) $filters['kitchen_id']);
        }

        if (! empty($filters['order_status'])) {
            $query->where('order_status', $filters['order_status']);
        }

        if (! empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (! empty($filters['order_type'])) {
            $query->where('order_type', $filters['order_type']);
        }

        if (! empty($filters['order_date'])) {
            $query->where('order_date', $filters['order_date']);
        }

        if (! empty($filters['delivery_date'])) {
            $query->where('delivery_date', $filters['delivery_date']);
        }

        if (! empty($filters['meal_category_id'])) {
            $query->where('meal_category_id', (int) $filters['meal_category_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getById(int $id): ?Order
    {
        return $this->model->with([
            'customer', 'subscription.subscriptionPlan', 'kitchen', 'address',
            'deliveryZone', 'mealCategory', 'mealType', 'meal',
            'orderItems.meal', 'statusHistory.changedBy',
            'cancellations.cancelledBy', 'refunds.processedBy',
            'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?Order
    {
        return $this->model->where('uuid', $uuid)
            ->with([
                'customer', 'subscription.subscriptionPlan', 'kitchen', 'address',
                'deliveryZone', 'mealCategory', 'mealType', 'meal',
                'orderItems.meal', 'statusHistory.changedBy',
                'cancellations.cancelledBy', 'refunds.processedBy',
                'createdBy', 'updatedBy',
            ])
            ->first();
    }

    public function create(array $data): Order
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Order
    {
        $order = $this->model->find($id);

        if (! $order) {
            return null;
        }

        $order->update($data);

        return $order->fresh();
    }

    public function delete(int $id): bool
    {
        $order = $this->model->find($id);

        if (! $order) {
            return false;
        }

        return $order->delete();
    }

    public function restore(int $id): bool
    {
        $order = $this->model->withTrashed()->find($id);

        if (! $order) {
            return false;
        }

        return $order->restore();
    }

    public function forceDelete(int $id): bool
    {
        $order = $this->model->withTrashed()->find($id);

        if (! $order) {
            return false;
        }

        return $order->forceDelete();
    }

    public function getStats(): array
    {
        $query = $this->model->query();

        return [
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('order_status', 'pending')->count(),
            'in_progress' => (clone $query)->whereIn('order_status', ['confirmed', 'preparing', 'ready', 'out_for_delivery'])->count(),
            'confirmed' => (clone $query)->where('order_status', 'confirmed')->count(),
            'preparing' => (clone $query)->where('order_status', 'preparing')->count(),
            'ready' => (clone $query)->where('order_status', 'ready')->count(),
            'out_for_delivery' => (clone $query)->where('order_status', 'out_for_delivery')->count(),
            'delivered' => (clone $query)->where('order_status', 'delivered')->count(),
            'completed' => (clone $query)->where('order_status', 'completed')->count(),
            'cancelled' => (clone $query)->where('order_status', 'cancelled')->count(),
            'refunded' => (clone $query)->where('order_status', 'refunded')->count(),
        ];
    }

    public function getDashboardStats(): array
    {
        $stats = $this->getStats();
        $stats['total_revenue'] = (float) $this->model->where('payment_status', 'paid')->sum('total_amount');
        $stats['today_count'] = $this->model->where('order_date', now()->toDateString())->count();
        $stats['today_revenue'] = (float) $this->model
            ->where('order_date', now()->toDateString())
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        return $stats;
    }

    public function getTodayOrders(int $kitchenId = null): Collection
    {
        $query = $this->model->query()
            ->with(['customer', 'kitchen', 'mealCategory', 'mealType', 'meal', 'orderItems.meal'])
            ->where('delivery_date', now()->toDateString())
            ->whereNotIn('order_status', ['cancelled', 'refunded']);

        if ($kitchenId) {
            $query->where('kitchen_id', $kitchenId);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function generateOrderNumber(): string
    {
        $maxNumber = $this->model->withTrashed()->max('order_number');
        if ($maxNumber && preg_match('/ORD-(\d+)/', $maxNumber, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        } else {
            $nextNumber = 1;
        }

        return 'ORD-' . str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
