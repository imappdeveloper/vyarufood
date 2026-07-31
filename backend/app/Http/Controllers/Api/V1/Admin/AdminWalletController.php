<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Payment\WalletResource;
use App\Http\Resources\Payment\WalletTransactionResource;
use App\Services\Payment\WalletServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminWalletController extends BaseController
{
    public function __construct(
        private readonly WalletServiceInterface $walletService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'customer_id']);
        $paginator = $this->walletService->getPaginatedWallets($filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Wallets retrieved successfully');
    }

    public function show(string $uuid): JsonResponse
    {
        $wallet = $this->walletService->getWalletByUuid($uuid);
        if (! $wallet) return $this->notFoundResponse('Wallet not found');
        $wallet->load('transactions');
        return $this->successResponse(new WalletResource($wallet), 'Wallet retrieved successfully');
    }

    public function transactions(Request $request, string $uuid): JsonResponse
    {
        $wallet = $this->walletService->getWalletByUuid($uuid);
        if (! $wallet) return $this->notFoundResponse('Wallet not found');

        $perPage = (int) $request->input('per_page', 15);
        $filters = $request->only(['transaction_type', 'date_from', 'date_to']);
        $paginator = $this->walletService->getWalletHistory($wallet->id, $filters, $perPage);
        return $this->paginatedResponse(JsonResource::collection($paginator), 'Wallet transactions retrieved successfully');
    }

    public function adjustBalance(Request $request, string $uuid): JsonResponse
    {
        $wallet = $this->walletService->getWalletByUuid($uuid);
        if (! $wallet) return $this->notFoundResponse('Wallet not found');

        $request->validate([
            'amount' => 'required|numeric',
            'remarks' => 'nullable|string|max:500',
        ]);

        $transaction = $this->walletService->adjustWallet(
            $wallet->id,
            (float) $request->input('amount'),
            $request->input('remarks'),
        );

        return $this->successResponse(new WalletTransactionResource($transaction), 'Wallet balance adjusted successfully');
    }
}
