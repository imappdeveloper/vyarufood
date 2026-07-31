<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\WalletTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WalletTransactionRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getPaginatedByWallet(int $walletId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?WalletTransaction;

    public function findByUuid(string $uuid): ?WalletTransaction;

    public function create(array $data): WalletTransaction;

    public function update(WalletTransaction $transaction, array $data): WalletTransaction;
}
