<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Constants\AppConstants;
use App\Http\Requests\Order\BulkStatusUpdateRequest;
use App\Http\Requests\Order\CancelOrderRequest;
use App\Http\Requests\Order\RefundOrderRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use App\Services\Order\OrderServiceInterface;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    public function __construct(
        private OrderServiceInterface $orderService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Order::class);

            $filters = $request->only([
                'search', 'customer_id', 'order_type', 'kitchen_id',
                'meal_id', 'meal_category_id', 'subscription_id',
                'order_status', 'payment_status', 'payment_method',
                'delivery_date_from', 'delivery_date_to',
                'created_date_from', 'created_date_to',
            ]);
            $perPage = min((int) $request->input('per_page', AppConstants::PER_PAGE_DEFAULT), AppConstants::PER_PAGE_MAX);

            $orders = $this->orderService->getPaginatedOrders($filters, $perPage);

            return $this->paginatedResponse(
                OrderResource::collection($orders),
                'Orders retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            $this->authorize('create', Order::class);

            $validated = $request->validated();
            $items = $validated['items'] ?? [];
            unset($validated['items']);
            $dto = \App\DTOs\Order\OrderDTO::fromArray($validated);
            $order = $this->orderService->createOrder($dto, $items);

            return $this->createdResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'meal', 'mealCategory', 'mealType', 'orderItems', 'createdBy', 'updatedBy')
                ),
                'Order created successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $order);

            $order->load(
                'customer', 'kitchen', 'address', 'subscription', 'deliveryZone',
                'meal', 'mealCategory', 'mealType',
                'orderItems', 'orderItems.meal', 'orderItems.mealCategory', 'orderItems.mealType',
                'statusHistory', 'statusHistory.changedBy',
                'cancellations', 'cancellations.cancelledBy',
                'refunds', 'refunds.processedBy',
                'createdBy', 'updatedBy'
            );

            return $this->successResponse(
                new OrderResource($order),
                'Order retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateOrderRequest $request, string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $order);

            $validated = $request->validated();
            $order = $this->orderService->updateOrder($order->id, $validated);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'meal', 'mealCategory', 'mealType', 'orderItems', 'createdBy', 'updatedBy')
                ),
                'Order updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $order);

            $this->orderService->deleteOrder($order->id);

            return $this->successResponse(null, 'Order deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function restore(string $uuid): JsonResponse
    {
        try {
            $order = Order::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('restore', $order);

            $result = $this->orderService->restoreOrder($order->id);

            if (! $result) {
                return $this->errorResponse('Failed to restore order', 400);
            }

            return $this->successResponse(null, 'Order restored successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function forceDelete(string $uuid): JsonResponse
    {
        try {
            $order = Order::withTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('delete', $order);

            $this->orderService->forceDeleteOrder($order->id);

            return $this->successResponse(null, 'Order permanently deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function confirm(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('manageStatus', $order);

            $order = $this->orderService->confirmOrder($order->id);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'createdBy', 'updatedBy')
                ),
                'Order confirmed successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function prepare(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('manageStatus', $order);

            $order = $this->orderService->prepareOrder($order->id);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'createdBy', 'updatedBy')
                ),
                'Order is now being prepared'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function ready(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('manageStatus', $order);

            $order = $this->orderService->readyOrder($order->id);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'createdBy', 'updatedBy')
                ),
                'Order marked as ready'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function dispatch(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('manageStatus', $order);

            $order = $this->orderService->dispatchOrder($order->id);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'createdBy', 'updatedBy')
                ),
                'Order dispatched for delivery'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function deliver(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('manageStatus', $order);

            $order = $this->orderService->deliverOrder($order->id);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'createdBy', 'updatedBy')
                ),
                'Order marked as delivered'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function updatePaymentStatus(Request $request, string $uuid): JsonResponse
    {
        try {
            $request->validate([
                'payment_status' => 'required|string|in:pending,paid,failed,refunded,partial_refund',
            ]);

            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('update', $order);

            $order->update([
                'payment_status' => $request->input('payment_status'),
            ]);

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'createdBy', 'updatedBy')
                ),
                'Payment status updated successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function cancel(CancelOrderRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $order = Order::withoutTrashed()->where('id', $validated['order_id'])->firstOrFail();
            $this->authorize('cancel', $order);

            $order = $this->orderService->cancelOrder(
                $order->id,
                $validated['reason'],
                $validated['notes'] ?? null,
            );

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'cancellations', 'createdBy', 'updatedBy')
                ),
                'Order cancelled successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function refund(RefundOrderRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $order = Order::withoutTrashed()->where('id', $validated['order_id'])->firstOrFail();
            $this->authorize('refund', $order);

            $order = $this->orderService->refundOrder(
                $order->id,
                $validated['amount'],
                $validated['reason'],
                $validated['method'],
            );

            return $this->successResponse(
                new OrderResource(
                    $order->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'statusHistory', 'refunds', 'createdBy', 'updatedBy')
                ),
                'Refund processed successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function bulkUpdateStatus(BulkStatusUpdateRequest $request): JsonResponse
    {
        try {
            $this->authorize('manageStatus', Order::class);

            $validated = $request->validated();
            $result = $this->orderService->bulkUpdateStatus(
                $validated['order_ids'],
                $validated['status'],
            );

            return $this->successResponse($result, 'Orders status updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function duplicate(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('create', Order::class);

            $newOrder = $this->orderService->duplicateOrder($order->id);

            return $this->createdResponse(
                new OrderResource(
                    $newOrder->load('customer', 'kitchen', 'address', 'subscription', 'orderItems', 'createdBy', 'updatedBy')
                ),
                'Order duplicated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getStats(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Order::class);

            $filters = $request->only([
                'customer_id', 'kitchen_id', 'order_type',
                'order_status', 'payment_status', 'date_from', 'date_to',
            ]);
            $stats = $this->orderService->getStats();

            return $this->successResponse($stats, 'Order statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getDashboardStats(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Order::class);

            $filters = $request->only([
                'date_from', 'date_to', 'kitchen_id',
            ]);
            $stats = $this->orderService->getDashboardStats($filters);

            return $this->successResponse($stats, 'Dashboard statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getTimeline(string $uuid): JsonResponse
    {
        try {
            $order = Order::withoutTrashed()->where('uuid', $uuid)->firstOrFail();
            $this->authorize('view', $order);

            $timeline = $this->orderService->getOrderTimeline($order->id);

            return $this->successResponse($timeline, 'Order timeline retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Order not found');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getTodaySummary(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Order::class);

            $filters = $request->only(['kitchen_id']);
            $summary = $this->orderService->getTodaySummary($filters);

            return $this->successResponse($summary, "Today's orders summary retrieved successfully");
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function generateOrders(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Order::class);

            $validated = $request->only(['date', 'kitchen_id']);
            $result = $this->orderService->generateOrders($validated);

            return $this->successResponse($result, 'Orders generated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function import(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Order::class);

            $request->validate([
                'file' => 'required|file|mimes:csv,txt|max:10240',
            ]);

            $result = $this->orderService->importOrders($request->file('file'));

            return $this->successResponse($result, 'Orders imported successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        try {
            $this->authorize('viewAny', Order::class);

            $filters = $request->only([
                'customer_id', 'order_type', 'kitchen_id',
                'order_status', 'payment_status',
                'delivery_date_from', 'delivery_date_to',
            ]);
            $result = $this->orderService->exportOrders($filters);

            return $this->successResponse($result, 'Orders exported successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
