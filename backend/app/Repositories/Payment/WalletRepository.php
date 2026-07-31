<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\Wallet;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WalletRepository extends BaseRepository implements WalletRepositoryInterface
{
    protected function model(): Wallet
    {
        return new Wallet;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['customer']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('wallet_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('customer', fn ($cq) => $cq->where('first_name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%"));
            });
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', (int) $filters['customer_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?Wallet
    {
        return $this->model->with(['customer', 'transactions'])->find($id);
    }

    public function findByUuid(string $uuid): ?Wallet
    {
        return $this->model->with(['customer', 'transactions'])
            ->where('uuid', $uuid)
            ->first();
    }

    public function findByCustomer(int $customerId): ?Wallet
    {
        return $this->model->where('customer_id', $customerId)->first();
    }

    public function create(array $data): Wallet
    {
        return $this->model->create($data);
    }

    public function update(Wallet $wallet, array $data): Wallet
    {
        $wallet->update($data);

        return $wallet->fresh();
    }

    public function updateBalance(Wallet $wallet, float $currentBalance, float $totalCredit, float $totalDebit): Wallet
    {
        $wallet->update([
            'current_balance' => $currentBalance,
            'total_credit' => $totalCredit,
            'total_debit' => $totalDebit,
        ]);

        return $wallet->fresh();
    }
}
