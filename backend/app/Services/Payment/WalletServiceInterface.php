<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WalletServiceInterface
{
    public function getPaginatedWallets(array $filters, int $perPage): LengthAwarePaginator;

    public function getWalletById(int $id): ?Wallet;

    public function getWalletByUuid(string $uuid): ?Wallet;

    public function getWalletByCustomer(int $customerId): ?Wallet;

    public function createWalletForCustomer(int $customerId): Wallet;

    public function rechargeWallet(array $data): WalletTransaction;

    public function deductFromWallet(
        int $customerId,
        float $amount,
        string $refType,
        ?int $refId,
        ?string $remarks,
    ): WalletTransaction;

    public function getWalletHistory(int $walletId, array $filters, int $perPage): LengthAwarePaginator;

    public function adjustWallet(int $walletId, float $amount, ?string $remarks): WalletTransaction;
}
