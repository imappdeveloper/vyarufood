<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Models\Customer;
use App\Models\PaymentTransaction;
use App\Services\Payment\PaymentServiceInterface;
use App\Services\Payment\WalletServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerPaymentController extends BaseController
{
    public function __construct(
        private readonly PaymentServiceInterface $paymentService,
        private readonly WalletServiceInterface $walletService,
    ) {}

    public function createPaymentOrder(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:upi,card,net_banking',
        ]);

        $order = $customer->orders()->where('id', $request->order_id)->first();
        if (!$order) {
            return $this->errorResponse('Order not found.', 404);
        }

        try {
            $transaction = $this->paymentService->createPayment(
                $customer->id,
                $order->id,
                (float) $request->amount,
                $request->payment_method,
                'razorpay',
            );

            return $this->successResponse([
                'transaction_id' => $transaction->id,
                'transaction_number' => $transaction->transaction_number,
                'amount' => $transaction->amount,
                'gateway_order_id' => $transaction->gateway_order_id,
            ], 'Payment order created');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function verifyPayment(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $request->validate([
            'transaction_id' => 'required|integer|exists:payment_transactions,id',
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        try {
            $transaction = PaymentTransaction::where('customer_id', $customer->id)
                ->where('id', $request->transaction_id)
                ->first();

            if (!$transaction) {
                return $this->errorResponse('Transaction not found.', 404);
            }

            $result = $this->paymentService->verifyPayment(
                $request->razorpay_payment_id,
                $request->razorpay_order_id,
                $request->razorpay_signature,
            );

            if ($result) {
                $transaction->update([
                    'status' => 'completed',
                    'gateway_transaction_id' => $request->razorpay_payment_id,
                    'payment_date' => now(),
                ]);

                if ($transaction->order_id) {
                    $transaction->order->update(['payment_status' => 'paid']);
                }

                return $this->successResponse(null, 'Payment verified successfully');
            }

            return $this->errorResponse('Payment verification failed.', 422);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function payFromWallet(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'amount' => 'required|numeric|min:1',
        ]);

        $order = $customer->orders()->where('id', $request->order_id)->first();
        if (!$order) {
            return $this->errorResponse('Order not found.', 404);
        }

        $amount = (float) $request->amount;
        $walletBalance = (float) $customer->wallet_balance;

        if ($amount > $walletBalance) {
            return $this->errorResponse('Insufficient wallet balance.', 422);
        }

        try {
            $customer->deductFromWallet($amount);
            $order->update([
                'payment_status' => 'paid',
                'payment_method' => 'wallet',
                'wallet_amount' => $amount,
            ]);

            return $this->successResponse(null, 'Payment completed from wallet');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function getWalletBalance(Request $request): JsonResponse
    {
        /** @var Customer $customer */
        $customer = $request->user();

        return $this->successResponse([
            'wallet_balance' => (float) $customer->wallet_balance,
        ]);
    }
}
