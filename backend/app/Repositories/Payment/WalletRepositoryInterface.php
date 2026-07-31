<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\Wallet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WalletRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Wallet;

    public function findByUuid(string $uuid): ?Wallet;

    public function findByCustomer(int $customerId): ?Wallet;

    public function create(array $data): Wallet;

    public function update(Wallet $wallet, array $data): Wallet;

    public function updateBalance(Wallet $wallet, float $currentBalance, float $totalCredit, float $totalDebit): Wallet;
}
