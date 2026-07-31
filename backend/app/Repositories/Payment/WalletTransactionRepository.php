<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\WalletTransaction;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WalletTransactionRepository extends BaseRepository implements WalletTransactionRepositoryInterface
{
    protected function model(): WalletTransaction
    {
        return new WalletTransaction;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['wallet.customer']);

        if (! empty($filters['wallet_id'])) {
            $query->where('wallet_id', (int) $filters['wallet_id']);
        }

        if (! empty($filters['transaction_type'])) {
            $query->where('transaction_type', $filters['transaction_type']);
        }

        if (! empty($filters['reference_type'])) {
            $query->where('reference_type', $filters['reference_type']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getPaginatedByWallet(int $walletId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['wallet', 'createdBy'])
            ->where('wallet_id', $walletId);

        if (! empty($filters['transaction_type'])) {
            $query->where('transaction_type', $filters['transaction_type']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?WalletTransaction
    {
        return $this->model->with(['wallet.customer'])->find($id);
    }

    public function findByUuid(string $uuid): ?WalletTransaction
    {
        return $this->model->with(['wallet.customer'])
            ->where('uuid', $uuid)
            ->first();
    }

    public function create(array $data): WalletTransaction
    {
        return $this->model->create($data);
    }

    public function update(WalletTransaction $transaction, array $data): WalletTransaction
    {
        $transaction->update($data);

        return $transaction->fresh();
    }
}
