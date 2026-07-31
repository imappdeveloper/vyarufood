<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Payment\PaymentTransactionResource;
use App\Services\Payment\PaymentServiceInterface;
use App\Services\Payment\WebhookServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentGatewayController extends BaseController
{
    public function __construct(
        private readonly WebhookServiceInterface $webhookService,
        private readonly PaymentServiceInterface $paymentService,
    ) {}

    public function razorpayWebhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        $signature = $request->header('X-Razorpay-Signature', '');

        $this->webhookService->processWebhook([
            'gateway' => 'razorpay',
            'payload' => $payload,
            'signature' => $signature,
        ]);

        return response()->json(['status' => 'ok'], 200);
    }

    public function createOrder(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string|size:3',
            'payment_type' => 'required|string|in:order,subscription,recharge',
            'customer_id' => 'required|integer|exists:customers,id',
        ]);

        $payment = $this->paymentService->createPayment($request->validated());

        return $this->createdResponse(
            new PaymentTransactionResource($payment),
            'Payment order created successfully',
        );
    }

    public function verifyPayment(Request $request): JsonResponse
    {
        $request->validate([
            'gateway_order_id' => 'required|string',
            'gateway_transaction_id' => 'required|string',
        ]);

        $payment = $this->paymentService->verifyPayment(
            $request->input('gateway_order_id'),
            $request->input('gateway_transaction_id'),
            $request->all(),
        );

        return $this->successResponse(
            new PaymentTransactionResource($payment),
            'Payment verified successfully',
        );
    }
}
