<?php

declare(strict_types=1);

namespace App\Services\Order;

use App\DTOs\Order\OrderDTO;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\OrderCancellation;
use App\Models\OrderRefund;
use App\Models\CustomerSubscription;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Order\OrderItemRepositoryInterface;
use App\Constants\AppConstants;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

class OrderService extends BaseService implements OrderServiceInterface
{
    protected string $moduleName = 'order';

    private const VALID_TRANSITIONS = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['preparing', 'cancelled'],
        'preparing' => ['ready', 'cancelled'],
        'ready' => ['out_for_delivery', 'cancelled'],
        'out_for_delivery' => ['delivered', 'cancelled'],
        'delivered' => ['completed', 'refunded'],
        'completed' => ['refunded'],
        'cancelled' => ['refunded'],
    ];

    public function __construct(
        protected OrderRepositoryInterface $orderRepo,
        protected OrderItemRepositoryInterface $orderItemRepo,
    ) {}

    public function getPaginatedOrders(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->orderRepo->getPaginated($filters, $perPage);
    }

    public function getOrderById(int $id): ?Order
    {
        return $this->orderRepo->getById($id);
    }

    public function getOrderByUuid(string $uuid): ?Order
    {
        return $this->orderRepo->getByUuid($uuid);
    }

    public function createOrder(OrderDTO $dto, array $items = []): Order
    {
        return $this->transaction(function () use ($dto, $items) {
            $createdBy = auth()->guard('admin')->id();

            $subtotal = 0.0;
            $taxTotal = 0.0;
            $discountTotal = 0.0;

            foreach ($items as $item) {
                $quantity = (int) ($item['quantity'] ?? 1);
                $unitPrice = (float) ($item['unit_price'] ?? 0);
                $tax = (float) ($item['tax'] ?? 0);
                $discount = (float) ($item['discount'] ?? 0);
                $lineTotal = ($unitPrice * $quantity) + $tax - $discount;

                $subtotal += $unitPrice * $quantity;
                $taxTotal += $tax;
                $discountTotal += $discount;
            }

            $unitPrice = $dto->unitPrice;

            if (empty($items) && $dto->quantity > 0) {
                if ($unitPrice <= 0 && $dto->mealId) {
                    $meal = \App\Models\Meal::find($dto->mealId);
                    if ($meal) {
                        $unitPrice = (float) ($meal->price ?? 0);
                    }
                }
                $subtotal = $unitPrice * $dto->quantity;
                $taxTotal = $subtotal * ($dto->taxPercentage / 100);
                $discountTotal = $dto->discountAmount;
            }

            $total = $subtotal + $taxTotal - $discountTotal - $dto->couponAmount + $dto->deliveryCharge;

            $data = [
                'order_number' => $this->orderRepo->generateOrderNumber(),
                'order_type' => $dto->orderType,
                'customer_id' => $dto->customerId,
                'subscription_id' => $dto->subscriptionId,
                'kitchen_id' => $dto->kitchenId,
                'address_id' => $dto->addressId,
                'delivery_zone_id' => $dto->deliveryZoneId,
                'order_date' => $dto->orderDate ?? now()->toDateString(),
                'delivery_date' => $dto->deliveryDate ?? now()->toDateString(),
                'meal_category_id' => $dto->mealCategoryId,
                'meal_type_id' => $dto->mealTypeId,
                'meal_id' => $dto->mealId,
                'quantity' => $dto->quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'discount_amount' => $discountTotal,
                'coupon_amount' => $dto->couponAmount,
                'tax_amount' => $taxTotal,
                'delivery_charge' => $dto->deliveryCharge,
                'total_amount' => $total,
                'payment_status' => 'pending',
                'payment_method' => $dto->paymentMethod,
                'order_status' => 'pending',
                'delivery_slot' => $dto->deliverySlot,
                'delivery_instruction' => $dto->deliveryInstruction,
                'wallet_amount' => $dto->walletAmount,
                'reward_points_used' => $dto->rewardPointsUsed,
                'notes' => $dto->notes,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
            ];

            $order = $this->orderRepo->create($data);

            if (! empty($items)) {
                $orderItems = array_map(fn ($item) => [
                    'order_id' => $order->id,
                    'meal_id' => $item['meal_id'] ?? null,
                    'meal_name' => $item['meal_name'] ?? '',
                    'meal_category_id' => $item['meal_category_id'] ?? null,
                    'meal_type_id' => $item['meal_type_id'] ?? null,
                    'quantity' => $item['quantity'] ?? 1,
                    'unit_price' => $item['unit_price'] ?? 0,
                    'tax' => $item['tax'] ?? 0,
                    'discount' => $item['discount'] ?? 0,
                    'total' => (($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1)) + ($item['tax'] ?? 0) - ($item['discount'] ?? 0),
                    'remarks' => $item['remarks'] ?? null,
                ], $items);

                $this->orderItemRepo->createMultiple($order->id, $orderItems);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => 'new',
                'to_status' => 'pending',
                'reason' => 'Order created',
                'changed_by' => $createdBy,
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order created', ['order_id' => $order->id, 'order_number' => $order->order_number]);
            $this->logActivity('order_created', $order);

            return $order->fresh();
        });
    }

    public function updateOrder(int $id, OrderDTO $dto): ?Order
    {
        return $this->transaction(function () use ($id, $dto) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            $updatedBy = auth()->guard('admin')->id();

            $data = array_filter([
                'order_type' => $dto->orderType,
                'customer_id' => $dto->customerId,
                'subscription_id' => $dto->subscriptionId,
                'kitchen_id' => $dto->kitchenId,
                'address_id' => $dto->addressId,
                'delivery_zone_id' => $dto->deliveryZoneId,
                'order_date' => $dto->orderDate,
                'delivery_date' => $dto->deliveryDate,
                'meal_category_id' => $dto->mealCategoryId,
                'meal_type_id' => $dto->mealTypeId,
                'meal_id' => $dto->mealId,
                'quantity' => $dto->quantity,
                'unit_price' => $dto->unitPrice,
                'discount_amount' => $dto->discountAmount,
                'coupon_amount' => $dto->couponAmount,
                'delivery_charge' => $dto->deliveryCharge,
                'delivery_slot' => $dto->deliverySlot,
                'delivery_instruction' => $dto->deliveryInstruction,
                'wallet_amount' => $dto->walletAmount,
                'reward_points_used' => $dto->rewardPointsUsed,
                'payment_method' => $dto->paymentMethod,
                'notes' => $dto->notes,
                'updated_by' => $updatedBy,
            ], fn ($v) => $v !== null);

            $updated = $this->orderRepo->update($id, $data);

            CacheManager::flush('order');

            $this->logInfo('Order updated', ['order_id' => $id]);
            $this->logActivity('order_updated', $updated);

            return $updated;
        });
    }

    public function deleteOrder(int $id): bool
    {
        $result = $this->orderRepo->delete($id);

        if ($result) {
            CacheManager::flush('order');

            $this->logInfo('Order deleted', ['order_id' => $id]);
        }

        return $result;
    }

    public function restoreOrder(int $id): bool
    {
        $result = $this->orderRepo->restore($id);

        if ($result) {
            CacheManager::flush('order');

            $this->logInfo('Order restored', ['order_id' => $id]);
        }

        return $result;
    }

    public function forceDeleteOrder(int $id): bool
    {
        $result = $this->orderRepo->forceDelete($id);

        if ($result) {
            CacheManager::flush('order');

            $this->logInfo('Order force deleted', ['order_id' => $id]);
        }

        return $result;
    }

    public function confirmOrder(int $id): ?Order
    {
        return $this->transaction(function () use ($id) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            $this->validateTransition($order->order_status, 'confirmed');

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'confirmed',
                'updated_by' => $updatedBy,
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'confirmed',
                'reason' => 'Order confirmed',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order confirmed', ['order_id' => $id]);
            $this->logActivity('order_confirmed', $updated);

            return $updated;
        });
    }

    public function prepareOrder(int $id): ?Order
    {
        return $this->transaction(function () use ($id) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            $this->validateTransition($order->order_status, 'preparing');

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'preparing',
                'updated_by' => $updatedBy,
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'preparing',
                'reason' => 'Order preparation started',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order preparing', ['order_id' => $id]);
            $this->logActivity('order_preparing', $updated);

            return $updated;
        });
    }

    public function readyOrder(int $id): ?Order
    {
        return $this->transaction(function () use ($id) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            $this->validateTransition($order->order_status, 'ready');

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'ready',
                'updated_by' => $updatedBy,
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'ready',
                'reason' => 'Order ready for dispatch',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order ready', ['order_id' => $id]);
            $this->logActivity('order_ready', $updated);

            return $updated;
        });
    }

    public function dispatchOrder(int $id): ?Order
    {
        return $this->transaction(function () use ($id) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            $this->validateTransition($order->order_status, 'out_for_delivery');

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'out_for_delivery',
                'updated_by' => $updatedBy,
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'out_for_delivery',
                'reason' => 'Order dispatched for delivery',
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order dispatched', ['order_id' => $id]);
            $this->logActivity('order_dispatched', $updated);

            return $updated;
        });
    }

    public function deliverOrder(int $id): ?Order
    {
        return $this->transaction(function () use ($id) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            $this->validateTransition($order->order_status, 'delivered');

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'delivered',
                'updated_by' => $updatedBy,
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'delivered',
                'reason' => 'Order delivered',
                'changed_by' => $updatedBy,
            ]);

            if ($order->subscription_id) {
                CustomerSubscription::where('id', $order->subscription_id)
                    ->increment('consumed_meals');
            }

            CacheManager::flush('order');

            $this->logInfo('Order delivered', ['order_id' => $id]);
            $this->logActivity('order_delivered', $updated);

            return $updated;
        });
    }

    public function cancelOrder(int $id, string $reason, ?string $notes = null): ?Order
    {
        return $this->transaction(function () use ($id, $reason, $notes) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            if (in_array($order->order_status, ['delivered', 'completed', 'refunded'])) {
                throw new \RuntimeException('Cannot cancel an order with status: ' . $order->order_status);
            }

            $updatedBy = auth()->guard('admin')->id();

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'cancelled',
                'cancelled_at' => now(),
                'cancelled_by' => $updatedBy,
                'cancellation_reason' => $reason,
                'updated_by' => $updatedBy,
            ]);

            OrderCancellation::create([
                'order_id' => $id,
                'cancellation_reason' => $reason,
                'additional_notes' => $notes,
                'cancelled_by' => $updatedBy,
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'cancelled',
                'reason' => $reason,
                'changed_by' => $updatedBy,
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order cancelled', ['order_id' => $id, 'reason' => $reason]);
            $this->logActivity('order_cancelled', $updated);

            return $updated;
        });
    }

    public function refundOrder(int $id, float $amount, string $reason, string $method = 'wallet'): ?Order
    {
        return $this->transaction(function () use ($id, $amount, $reason, $method) {
            $order = $this->orderRepo->getById($id);

            if (! $order) {
                return null;
            }

            if (! in_array($order->order_status, ['delivered', 'completed', 'cancelled'])) {
                throw new \RuntimeException('Cannot refund an order with status: ' . $order->order_status);
            }

            $updatedBy = auth()->guard('admin')->id();
            $refundNumber = 'REF-' . str_pad((string) ($id), 6, '0', STR_PAD_LEFT);

            $updated = $this->orderRepo->update($id, [
                'order_status' => 'refunded',
                'payment_status' => 'refunded',
                'updated_by' => $updatedBy,
            ]);

            OrderRefund::create([
                'order_id' => $id,
                'refund_number' => $refundNumber,
                'refund_amount' => $amount,
                'refund_method' => $method,
                'refund_status' => 'processed',
                'refund_reason' => $reason,
                'processed_by' => $updatedBy,
                'processed_at' => now(),
            ]);

            OrderStatusHistory::create([
                'order_id' => $id,
                'from_status' => $order->order_status,
                'to_status' => 'refunded',
                'reason' => $reason,
                'changed_by' => $updatedBy,
                'metadata' => [
                    'refund_amount' => $amount,
                    'refund_method' => $method,
                ],
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order refunded', ['order_id' => $id, 'amount' => $amount]);
            $this->logActivity('order_refunded', $updated);

            return $updated;
        });
    }

    public function bulkUpdateStatus(array $orderIds, string $status): int
    {
        return $this->transaction(function () use ($orderIds, $status) {
            $count = 0;
            $updatedBy = auth()->guard('admin')->id();

            foreach ($orderIds as $orderId) {
                $order = $this->orderRepo->getById($orderId);

                if (! $order) {
                    continue;
                }

                try {
                    $this->validateTransition($order->order_status, $status);

                    $this->orderRepo->update($orderId, [
                        'order_status' => $status,
                        'updated_by' => $updatedBy,
                    ]);

                    OrderStatusHistory::create([
                        'order_id' => $orderId,
                        'from_status' => $order->order_status,
                        'to_status' => $status,
                        'reason' => 'Bulk status update',
                        'changed_by' => $updatedBy,
                    ]);

                    $count++;
                } catch (\RuntimeException) {
                    continue;
                }
            }

            if ($count > 0) {
                CacheManager::flush('order');

                $this->logInfo('Bulk orders status updated', ['count' => $count, 'status' => $status]);
            }

            return $count;
        });
    }

    public function duplicateOrder(int $id): ?Order
    {
        return $this->transaction(function () use ($id) {
            $original = $this->orderRepo->getById($id);

            if (! $original) {
                return null;
            }

            $createdBy = auth()->guard('admin')->id();

            $data = [
                'order_number' => $this->orderRepo->generateOrderNumber(),
                'order_type' => $original->order_type,
                'customer_id' => $original->customer_id,
                'subscription_id' => $original->subscription_id,
                'kitchen_id' => $original->kitchen_id,
                'address_id' => $original->address_id,
                'delivery_zone_id' => $original->delivery_zone_id,
                'order_date' => now()->toDateString(),
                'delivery_date' => now()->toDateString(),
                'meal_category_id' => $original->meal_category_id,
                'meal_type_id' => $original->meal_type_id,
                'meal_id' => $original->meal_id,
                'quantity' => $original->quantity,
                'unit_price' => $original->unit_price,
                'subtotal' => $original->subtotal,
                'discount_amount' => $original->discount_amount,
                'coupon_amount' => 0,
                'tax_amount' => $original->tax_amount,
                'delivery_charge' => $original->delivery_charge,
                'total_amount' => $original->total_amount,
                'payment_status' => 'pending',
                'payment_method' => $original->payment_method,
                'order_status' => 'pending',
                'delivery_slot' => $original->delivery_slot,
                'delivery_instruction' => $original->delivery_instruction,
                'wallet_amount' => 0,
                'reward_points_used' => 0,
                'notes' => $original->notes,
                'created_by' => $createdBy,
                'updated_by' => $createdBy,
            ];

            $order = $this->orderRepo->create($data);

            $originalItems = $this->orderItemRepo->getByOrderId($original->id);

            if ($originalItems->isNotEmpty()) {
                $items = $originalItems->map(fn ($item) => [
                    'order_id' => $order->id,
                    'meal_id' => $item->meal_id,
                    'meal_name' => $item->meal_name,
                    'meal_category_id' => $item->meal_category_id,
                    'meal_type_id' => $item->meal_type_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'tax' => $item->tax,
                    'discount' => $item->discount,
                    'total' => $item->total,
                    'remarks' => $item->remarks,
                ])->toArray();

                $this->orderItemRepo->createMultiple($order->id, $items);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'from_status' => 'new',
                'to_status' => 'pending',
                'reason' => 'Duplicated from order #' . $original->order_number,
                'changed_by' => $createdBy,
                'metadata' => ['original_order_id' => $original->id],
            ]);

            CacheManager::flush('order');

            $this->logInfo('Order duplicated', ['original_id' => $id, 'new_id' => $order->id]);
            $this->logActivity('order_duplicated', $order);

            return $order->fresh();
        });
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('order', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return $this->orderRepo->getStats();
        });
    }

    public function getDashboardStats(): array
    {
        return $this->orderRepo->getDashboardStats();
    }

    public function getTimeline(int $orderId): array
    {
        $order = $this->orderRepo->getById($orderId);

        if (! $order) {
            return [];
        }

        $events = [];

        $statusHistory = $order->statusHistory()->orderBy('created_at', 'asc')->get();
        foreach ($statusHistory as $record) {
            $events[] = [
                'type' => 'status_change',
                'date' => $record->created_at->toIso8601String(),
                'from_status' => $record->from_status,
                'to_status' => $record->to_status,
                'reason' => $record->reason,
                'changed_by' => $record->changedBy?->name,
            ];
        }

        $cancellations = $order->cancellations()->orderBy('created_at', 'asc')->get();
        foreach ($cancellations as $record) {
            $events[] = [
                'type' => 'cancellation',
                'date' => $record->created_at->toIso8601String(),
                'reason' => $record->cancellation_reason,
                'notes' => $record->additional_notes,
                'cancelled_by' => $record->cancelledBy?->name,
            ];
        }

        $refunds = $order->refunds()->orderBy('created_at', 'asc')->get();
        foreach ($refunds as $record) {
            $events[] = [
                'type' => 'refund',
                'date' => $record->created_at->toIso8601String(),
                'refund_number' => $record->refund_number,
                'refund_amount' => $record->refund_amount,
                'refund_method' => $record->refund_method,
                'reason' => $record->refund_reason,
                'processed_by' => $record->processedBy?->name,
            ];
        }

        usort($events, fn ($a, $b) => strtotime($a['date']) - strtotime($b['date']));

        return $events;
    }

    public function getTodayOrdersSummary(?int $kitchenId = null): array
    {
        $orders = $this->orderRepo->getTodayOrders($kitchenId);

        $summary = [
            'total_count' => $orders->count(),
            'by_status' => [],
            'total_revenue' => 0.0,
            'total_meals' => 0,
        ];

        foreach ($orders as $order) {
            $status = $order->order_status;
            $summary['by_status'][$status] = ($summary['by_status'][$status] ?? 0) + 1;

            if (in_array($status, ['delivered', 'completed'])) {
                $summary['total_revenue'] += (float) $order->total_amount;
            }

            $summary['total_meals'] += $order->quantity;
        }

        return $summary;
    }

    public function generateDailySubscriptionOrders(string $date = null): array
    {
        return $this->transaction(function () use ($date) {
            $deliveryDate = $date ?? now()->toDateString();
            $createdBy = auth()->guard('admin')->id();

            $subscriptions = CustomerSubscription::query()
                ->where('subscription_status', 'active')
                ->where('next_delivery_date', '<=', $deliveryDate)
                ->where('end_date', '>=', $deliveryDate)
                ->where('remaining_meals', '>', 0)
                ->with(['customer', 'subscriptionPlan.planMeals.meal', 'kitchen', 'mealCategory'])
                ->get();

            $summary = [
                'date' => $deliveryDate,
                'total_subscriptions' => $subscriptions->count(),
                'orders_created' => 0,
                'orders_skipped' => 0,
                'errors' => [],
            ];

            foreach ($subscriptions as $subscription) {
                $existingOrder = Order::where('subscription_id', $subscription->id)
                    ->where('delivery_date', $deliveryDate)
                    ->exists();

                if ($existingOrder) {
                    $summary['orders_skipped']++;
                    continue;
                }

                try {
                    $plan = $subscription->subscriptionPlan;
                    $planMeals = $plan?->planMeals ?? collect();

                    $mealCategoryId = $subscription->meal_category_id ?? $plan?->meal_category_id;
                    $mealTypeId = null;
                    $mealId = null;
                    $unitPrice = 0.0;

                    if ($planMeals->isNotEmpty()) {
                        $dayOfWeek = strtolower(now()->parse($deliveryDate)->format('l'));

                        $dayMeals = $planMeals->filter(fn ($pm) => strtolower($pm->day_of_week) === $dayOfWeek);

                        if ($dayMeals->isEmpty()) {
                            $dayMeals = $planMeals->filter(fn ($pm) => empty($pm->day_of_week));
                        }

                        if ($dayMeals->isEmpty()) {
                            $dayMeals = $planMeals;
                        }

                        $firstMeal = $dayMeals->first();
                        $mealCategoryId = $firstMeal->meal_category_id ?? $mealCategoryId;
                        $mealTypeId = $firstMeal->meal_type_id;
                        $mealId = $firstMeal->meal_id;

                        $mealPrice = $firstMeal->meal?->offer_price ?? $firstMeal->meal?->price ?? 0;
                        $unitPrice = (float) $mealPrice;
                    }

                    $taxAmount = $unitPrice * ($plan?->tax_percentage ?? 0) / 100;
                    $subtotal = $unitPrice;
                    $total = $subtotal + $taxAmount - ($plan?->delivery_charge ?? 0);

                    $order = $this->orderRepo->create([
                        'order_number' => $this->orderRepo->generateOrderNumber(),
                        'order_type' => 'subscription',
                        'customer_id' => $subscription->customer_id,
                        'subscription_id' => $subscription->id,
                        'kitchen_id' => $subscription->kitchen_id,
                        'order_date' => now()->toDateString(),
                        'delivery_date' => $deliveryDate,
                        'delivery_slot' => $subscription->delivery_slot,
                        'meal_category_id' => $mealCategoryId,
                        'meal_type_id' => $mealTypeId,
                        'meal_id' => $mealId,
                        'quantity' => 1,
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                        'discount_amount' => 0,
                        'coupon_amount' => 0,
                        'tax_amount' => $taxAmount,
                        'delivery_charge' => $plan?->delivery_charge ?? 0,
                        'total_amount' => $total,
                        'payment_status' => 'pending',
                        'order_status' => 'pending',
                        'created_by' => $createdBy,
                        'updated_by' => $createdBy,
                    ]);

                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                'from_status' => 'new',
                        'to_status' => 'pending',
                        'reason' => 'Auto-generated from subscription',
                        'changed_by' => $createdBy,
                    ]);

                    $subscription->update([
                        'next_delivery_date' => now()->parse($deliveryDate)->addDay()->toDateString(),
                        'remaining_meals' => max(0, $subscription->remaining_meals - 1),
                    ]);

                    $summary['orders_created']++;
                } catch (\Exception $e) {
                    $summary['errors'][] = [
                        'subscription_id' => $subscription->id,
                        'error' => $e->getMessage(),
                    ];
                }
            }

            CacheManager::flush('order');

            $this->logInfo('Daily subscription orders generated', $summary);

            return $summary;
        });
    }

    public function importOrders(UploadedFile $file): array
    {
        $successes = 0;
        $failures = [];
        $createdBy = auth()->guard('admin')->id();

        $handle = fopen($file->getPathname(), 'r');
        $headers = fgetcsv($handle);

        $rowIndex = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $rowIndex++;

            try {
                $data = array_combine($headers, $row);

                $dto = OrderDTO::fromArray($data);
                $this->createOrder($dto);
                $successes++;
            } catch (\Exception $e) {
                $failures[] = [
                    'row' => $rowIndex,
                    'error' => $e->getMessage(),
                    'data' => $row,
                ];
            }
        }

        fclose($handle);

        return [
            'successes' => $successes,
            'failures' => $failures,
            'total' => $rowIndex,
        ];
    }

    public function exportOrders(array $filters = []): string
    {
        $orders = $this->orderRepo->getPaginated(array_merge($filters, ['per_page' => 1000]), 1000);

        $headers = [
            'order_number', 'order_type', 'customer_id', 'subscription_id',
            'kitchen_id', 'order_date', 'delivery_date', 'meal_category_id',
            'meal_type_id', 'meal_id', 'quantity', 'unit_price', 'subtotal',
            'discount_amount', 'coupon_amount', 'tax_amount', 'delivery_charge',
            'total_amount', 'payment_status', 'payment_method', 'order_status',
            'delivery_slot', 'notes',
        ];

        $csv = implode(',', $headers) . "\n";

        foreach ($orders->items() as $order) {
            $row = [
                $order->order_number,
                $order->order_type,
                $order->customer_id,
                $order->subscription_id,
                $order->kitchen_id,
                $order->order_date?->toDateString(),
                $order->delivery_date?->toDateString(),
                $order->meal_category_id,
                $order->meal_type_id,
                $order->meal_id,
                $order->quantity,
                $order->unit_price,
                $order->subtotal,
                $order->discount_amount,
                $order->coupon_amount,
                $order->tax_amount,
                $order->delivery_charge,
                $order->total_amount,
                $order->payment_status,
                $order->payment_method,
                $order->order_status,
                $order->delivery_slot,
                $order->notes,
            ];

            $csv .= implode(',', array_map(fn ($v) => '"' . str_replace('"', '""', $v ?? '') . '"', $row)) . "\n";
        }

        return $csv;
    }

    private function validateTransition(string $currentStatus, string $newStatus): void
    {
        $allowed = self::VALID_TRANSITIONS[$currentStatus] ?? [];

        if (! in_array($newStatus, $allowed)) {
            throw new \RuntimeException("Cannot transition from \"{$currentStatus}\" to \"{$newStatus}\".");
        }
    }
}
