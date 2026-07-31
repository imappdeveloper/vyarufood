<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Payment\PaymentTransactionResource;
use App\Http\Resources\Payment\WalletResource;
use App\Http\Resources\Payment\WalletTransactionResource;
use App\Services\Payment\PaymentServiceInterface;
use App\Services\Payment\WalletServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerWalletController extends BaseController
{
    public function __construct(
        private readonly WalletServiceInterface $walletService,
        private readonly PaymentServiceInterface $paymentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $customerId = $request->user()->id;
        $wallet = $this->walletService->getWalletByCustomer($customerId);
        if (!$wallet) {
            $wallet = $this->walletService->createWalletForCustomer($customerId);
        }
        return $this->successResponse(new WalletResource($wallet), 'Wallet retrieved successfully');
    }

    public function recharge(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string|size:3',
        ]);

        $customerId = $request->user()->id;
        $payment = $this->paymentService->createPayment([
            'customer_id' => $customerId,
            'amount' => $request->input('amount'),
            'currency' => $request->input('currency', 'INR'),
            'payment_type' => 'recharge',
        ]);

        return $this->createdResponse(
            new PaymentTransactionResource($payment),
            'Wallet recharge initiated successfully',
        );
    }

    public function pay(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'reference_type' => 'required|string',
            'reference_id' => 'nullable|integer',
            'remarks' => 'nullable|string|max:500',
        ]);

        $customerId = $request->user()->id;
        $transaction = $this->walletService->deductFromWallet(
            $customerId,
            (float) $request->input('amount'),
            $request->input('reference_type'),
            $request->input('reference_id'),
            $request->input('remarks'),
        );

        return $this->successResponse(
            new WalletTransactionResource($transaction),
            'Payment from wallet successful',
        );
    }

    public function history(Request $request): JsonResponse
    {
        $customerId = $request->user()->id;
        $wallet = $this->walletService->getWalletByCustomer($customerId);
        if (!$wallet) {
            $wallet = $this->walletService->createWalletForCustomer($customerId);
        }

        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['transaction_type', 'date_from', 'date_to']);
        $paginator = $this->walletService->getWalletHistory($wallet->id, $filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Wallet transaction history retrieved successfully');
    }

    public function paymentHistory(Request $request): JsonResponse
    {
        $customerId = $request->user()->id;
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['status', 'payment_type', 'date_from', 'date_to']);
        $paginator = $this->paymentService->getPaymentHistory($customerId, $filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Payment history retrieved successfully');
    }
}
