<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Payment\StorePaymentRefundRequest;
use App\Http\Resources\Payment\PaymentRefundResource;
use App\Http\Resources\Payment\PaymentTransactionResource;
use App\Services\Payment\PaymentRefundServiceInterface;
use App\Services\Payment\PaymentServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentController extends BaseController
{
    public function __construct(
        private readonly PaymentServiceInterface $paymentService,
        private readonly PaymentRefundServiceInterface $refundService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only([
            'search', 'gateway_name', 'status', 'payment_type',
            'customer_id', 'date_from', 'date_to',
        ]);
        $paginator = $this->paymentService->getPaginatedPayments($filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Payments retrieved successfully');
    }

    public function show(string $uuid): JsonResponse
    {
        $payment = $this->paymentService->getPaymentByUuid($uuid);
        if (! $payment) return $this->notFoundResponse('Payment not found');
        return $this->successResponse(new PaymentTransactionResource($payment), 'Payment retrieved successfully');
    }

    public function refunds(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'customer_id', 'date_from', 'date_to']);
        $paginator = $this->refundService->getPaginatedRefunds($filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Refunds retrieved successfully');
    }

    public function processRefund(StorePaymentRefundRequest $request): JsonResponse
    {
        $refund = $this->refundService->processRefund($request->validated());
        return $this->createdResponse(new PaymentRefundResource($refund), 'Refund processed successfully');
    }

    public function dashboardStats(): JsonResponse
    {
        return $this->successResponse($this->paymentService->getDashboardStats(), 'Payment dashboard stats retrieved successfully');
    }

    public function revenueSummary(Request $request): JsonResponse
    {
        $filters = $request->only(['date_from', 'date_to', 'gateway_name']);
        return $this->successResponse($this->paymentService->getRevenueSummary($filters), 'Revenue summary retrieved successfully');
    }

    public function webhookLogs(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'gateway_name', 'event_name', 'verification_status', 'date_from', 'date_to']);
        $paginator = $this->paymentService->getWebhookLogs($filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Webhook logs retrieved successfully');
    }
}
