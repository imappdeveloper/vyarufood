<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Repositories\Payment\WalletRepositoryInterface;
use App\Repositories\Payment\WalletTransactionRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class WalletService extends BaseService implements WalletServiceInterface
{
    protected string $moduleName = 'wallet';

    public function __construct(
        protected WalletRepositoryInterface $walletRepo,
        protected WalletTransactionRepositoryInterface $walletTransactionRepo,
    ) {}

    public function getPaginatedWallets(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->walletRepo->getPaginated($filters, $perPage);
    }

    public function getWalletById(int $id): ?Wallet
    {
        return $this->walletRepo->findById($id);
    }

    public function getWalletByUuid(string $uuid): ?Wallet
    {
        return $this->walletRepo->findByUuid($uuid);
    }

    public function getWalletByCustomer(int $customerId): ?Wallet
    {
        return $this->walletRepo->findByCustomer($customerId);
    }

    public function createWalletForCustomer(int $customerId): Wallet
    {
        $wallet = $this->walletRepo->findByCustomer($customerId);
        if ($wallet) {
            return $wallet;
        }

        return $this->walletRepo->create([
            'customer_id' => $customerId,
            'wallet_number' => 'WAL-' . strtoupper(Str::random(8)),
            'current_balance' => 0,
            'blocked_balance' => 0,
            'total_credit' => 0,
            'total_debit' => 0,
            'status' => 'active',
        ]);
    }

    public function rechargeWallet(array $data): WalletTransaction
    {
        return $this->transaction(function () use ($data) {
            $wallet = $this->walletRepo->findByCustomer($data['customer_id']);

            if (!$wallet) {
                $wallet = $this->walletRepo->create([
                    'customer_id' => $data['customer_id'],
                    'wallet_number' => 'WAL-' . strtoupper(Str::random(8)),
                    'current_balance' => 0,
                    'blocked_balance' => 0,
                    'total_credit' => 0,
                    'total_debit' => 0,
                    'status' => 'active',
                ]);
            }

            $openingBalance = (float) $wallet->current_balance;
            $amount = (float) $data['amount'];
            $closingBalance = $openingBalance + $amount;

            $this->walletRepo->updateBalance($wallet, $closingBalance, $wallet->total_credit + $amount, $wallet->total_debit);

            $transaction = $this->walletTransactionRepo->create([
                'wallet_id' => $wallet->id,
                'transaction_number' => 'WLT-TXN-' . strtoupper(Str::random(8)),
                'transaction_type' => 'credit',
                'reference_type' => $data['reference_type'] ?? 'wallet_recharge',
                'reference_id' => $data['reference_id'] ?? null,
                'opening_balance' => $openingBalance,
                'amount' => $amount,
                'closing_balance' => $closingBalance,
                'remarks' => $data['remarks'] ?? 'Wallet recharge',
                'created_by' => auth()->guard('admin')->id(),
            ]);

            $this->logInfo('Wallet recharged', [
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'closing_balance' => $closingBalance,
            ]);

            return $transaction;
        });
    }

    public function deductFromWallet(
        int $customerId,
        float $amount,
        string $refType,
        ?int $refId,
        ?string $remarks,
    ): WalletTransaction {
        return $this->transaction(function () use ($customerId, $amount, $refType, $refId, $remarks) {
            $wallet = $this->walletRepo->findByCustomer($customerId);

            if (!$wallet) {
                throw new \DomainException('Wallet not found for the customer.');
            }

            if ((float) $wallet->current_balance < $amount) {
                throw new \DomainException('Insufficient wallet balance.');
            }

            $openingBalance = (float) $wallet->current_balance;
            $closingBalance = $openingBalance - $amount;

            $this->walletRepo->updateBalance($wallet, $closingBalance, $wallet->total_credit, $wallet->total_debit + $amount);

            $transaction = $this->walletTransactionRepo->create([
                'wallet_id' => $wallet->id,
                'transaction_number' => 'WLT-TXN-' . strtoupper(Str::random(8)),
                'transaction_type' => 'debit',
                'reference_type' => $refType,
                'reference_id' => $refId,
                'opening_balance' => $openingBalance,
                'amount' => $amount,
                'closing_balance' => $closingBalance,
                'remarks' => $remarks,
                'created_by' => auth()->guard('admin')->id(),
            ]);

            $this->logInfo('Wallet debited', [
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'closing_balance' => $closingBalance,
            ]);

            return $transaction;
        });
    }

    public function getWalletHistory(int $walletId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->walletTransactionRepo->getPaginatedByWallet($walletId, $filters, $perPage);
    }

    public function adjustWallet(int $walletId, float $amount, ?string $remarks): WalletTransaction
    {
        return $this->transaction(function () use ($walletId, $amount, $remarks) {
            $wallet = $this->walletRepo->findById($walletId);

            if (!$wallet) {
                throw new \DomainException('Wallet not found.');
            }

            $openingBalance = (float) $wallet->current_balance;
            $closingBalance = $openingBalance + $amount;
            $transactionType = $amount >= 0 ? 'credit' : 'debit';
            $absAmount = abs($amount);

            $totalCredit = $wallet->total_credit + ($amount >= 0 ? $absAmount : 0);
            $totalDebit = $wallet->total_debit + ($amount < 0 ? $absAmount : 0);

            $this->walletRepo->updateBalance($wallet, $closingBalance, $totalCredit, $totalDebit);

            $transaction = $this->walletTransactionRepo->create([
                'wallet_id' => $wallet->id,
                'transaction_number' => 'WLT-ADJ-' . strtoupper(Str::random(8)),
                'transaction_type' => $transactionType,
                'reference_type' => 'admin_adjustment',
                'reference_id' => null,
                'opening_balance' => $openingBalance,
                'amount' => $absAmount,
                'closing_balance' => $closingBalance,
                'remarks' => $remarks ?? 'Admin adjustment',
                'created_by' => auth()->guard('admin')->id(),
            ]);

            $this->logInfo('Wallet adjusted', [
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'closing_balance' => $closingBalance,
            ]);

            return $transaction;
        });
    }
}
