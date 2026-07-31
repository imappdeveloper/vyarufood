<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CustomerCart\AddCartItemRequest;
use App\Http\Requests\CustomerCart\UpdateCartItemRequest;
use App\Http\Requests\CustomerCart\ApplyCouponRequest;
use App\Http\Requests\CustomerCart\ApplyWalletRequest;
use App\Http\Resources\Cart\CartResource;
use App\Models\Customer;
use App\Services\Cart\CartServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerCartController extends BaseController
{
    public function __construct(
        private readonly CartServiceInterface $cartService,
    ) {}

    public function getCart(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();
        $cart = $this->cartService->getCart($customer);

        if (!$cart || $cart->items()->count() === 0) {
            return $this->successResponse(new CartResource($this->emptyCart($customer)), 'Cart is empty');
        }

        return $this->successResponse(new CartResource($cart));
    }

    public function addItem(AddCartItemRequest $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $cart = $this->cartService->addItem(
                $customer,
                (int) $request->validated('meal_id'),
                (int) $request->validated('quantity'),
                $request->validated('special_instructions'),
            );

            return $this->successResponse(new CartResource($cart), 'Item added to cart');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function updateItem(UpdateCartItemRequest $request, int $itemId): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $cart = $this->cartService->updateItem(
                $customer,
                $itemId,
                (int) $request->validated('quantity'),
            );

            return $this->successResponse(new CartResource($cart), 'Cart updated');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $cart = $this->cartService->removeItem($customer, $itemId);
            return $this->successResponse(new CartResource($cart), 'Item removed from cart');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function clearCart(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();
        $this->cartService->clearCart($customer);

        return $this->successResponse(null, 'Cart cleared');
    }

    public function getCartCount(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();
        $count = $this->cartService->getCartCount($customer);

        return $this->successResponse(['count' => $count]);
    }

    public function applyCoupon(ApplyCouponRequest $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $cart = $this->cartService->applyCoupon($customer, $request->validated('coupon_code'));
            return $this->successResponse(new CartResource($cart), 'Coupon applied successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function removeCoupon(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $cart = $this->cartService->removeCoupon($customer);
            return $this->successResponse(new CartResource($cart), 'Coupon removed');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function applyWallet(ApplyWalletRequest $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $amount = $request->validated('amount') ? (float) $request->validated('amount') : null;
            $cart = $this->cartService->applyWallet($customer, $amount);
            return $this->successResponse(new CartResource($cart), 'Wallet applied successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function removeWallet(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        try {
            $cart = $this->cartService->removeWallet($customer);
            return $this->successResponse(new CartResource($cart), 'Wallet removed');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    private function emptyCart(Customer $customer): \App\Models\Cart
    {
        $cart = new \App\Models\Cart([
            'id' => 0,
            'customer_id' => $customer->id,
            'subtotal' => 0,
            'tax_amount' => 0,
            'delivery_charge' => 0,
            'discount_amount' => 0,
            'coupon_amount' => 0,
            'coupon_code' => null,
            'wallet_amount' => 0,
            'total_amount' => 0,
            'tax_percentage' => 0,
        ]);
        $cart->setRelation('items', collect());

        return $cart;
    }
}
