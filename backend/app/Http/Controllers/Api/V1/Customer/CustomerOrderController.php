<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Checkout\PlaceOrderRequest;
use App\Http\Resources\CustomerOrder\CustomerOrderResource;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Services\Checkout\CheckoutServiceInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerOrderController extends BaseController
{
    public function __construct(
        private readonly CheckoutServiceInterface $checkoutService,
    ) {}

    public function getCheckoutSummary(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $summary = $this->checkoutService->getCheckoutSummary($customer);
            return $this->successResponse([
                'cart' => new \App\Http\Resources\Cart\CartResource($summary['cart']),
                'has_unavailable_items' => $summary['has_unavailable_items'],
                'addresses' => \App\Http\Resources\CustomerAddress\CustomerAddressResource::collection($summary['addresses']),
                'wallet_balance' => $summary['wallet_balance'],
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function placeOrder(PlaceOrderRequest $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $order = $this->checkoutService->placeOrder($customer, $request->validated());
            return $this->successResponse(
                new CustomerOrderResource($order->load(['orderItems.meal', 'address.city', 'address.state', 'address.pincode'])),
                'Order placed successfully',
                201,
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function getOrders(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $perPage = min((int) $request->get('per_page', 15), 50);

        $query = Order::where('customer_id', $customer->id)
            ->with(['orderItems.meal', 'address.city', 'address.state'])
            ->orderBy('created_at', 'desc');

        if ($request->has('statuses') && $request->input('statuses') !== '') {
            $statuses = array_filter(explode(',', (string) $request->input('statuses')));
            if (!empty($statuses)) {
                $query->whereIn('order_status', $statuses);
            }
        }

        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate($perPage);

        return $this->paginatedResponse(
            CustomerOrderResource::collection($orders),
            'Orders retrieved successfully',
        );
    }

    public function getOrder(string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = request()->user();

        $order = Order::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->with(['orderItems.meal', 'address.city', 'address.state', 'address.pincode', 'statusHistory'])
            ->first();

        if (!$order) {
            return $this->errorResponse('Order not found.', 404);
        }

        return $this->successResponse(new CustomerOrderResource($order));
    }

    public function cancelOrder(Request $request, string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $order = Order::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->first();

        if (!$order) {
            return $this->errorResponse('Order not found.', 404);
        }

        if ($order->order_status !== 'pending') {
            return $this->errorResponse('Orders can only be cancelled before the admin confirms them.', 422);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $order->update([
            'order_status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->input('reason', 'Cancelled by customer'),
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => $order->getOriginal('order_status'),
            'to_status' => 'cancelled',
            'reason' => $request->input('reason', 'Cancelled by customer'),
        ]);

        if ($order->wallet_amount > 0) {
            $customer->addToWallet((float) $order->wallet_amount);
            $order->update(['wallet_amount' => 0]);
        }

        return $this->successResponse(
            new CustomerOrderResource($order->fresh(['orderItems.meal', 'address'])),
            'Order cancelled successfully',
        );
    }

    public function downloadInvoice(string $uuid): Response|JsonResponse
    {
        /** @var Customer $customer */
        $customer = request()->user();

        $order = Order::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->with(['orderItems.meal', 'address.city', 'address.state', 'address.pincode'])
            ->first();

        if (!$order) {
            return $this->errorResponse('Order not found.', 404);
        }

        $pdf = Pdf::loadView('invoices.order-invoice', [
            'order'   => $order,
            'customer' => $customer,
        ]);

        return $pdf->download("invoice-{$order->order_number}.pdf");
    }

    public function reorder(Request $request, string $uuid): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $order = Order::where('uuid', $uuid)
            ->where('customer_id', $customer->id)
            ->with(['orderItems'])
            ->first();

        if (!$order) {
            return $this->errorResponse('Order not found.', 404);
        }

        $cartService = app(\App\Services\Cart\CartServiceInterface::class);
        $cartService->clearCart($customer);

        foreach ($order->orderItems as $item) {
            if ($item->meal_id) {
                $cartService->addItem($customer, $item->meal_id, $item->quantity);
            }
        }

        return $this->successResponse(null, 'Items added to cart');
    }
}
