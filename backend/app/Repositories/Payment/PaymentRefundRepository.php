<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\PaymentRefund;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaymentRefundRepository extends BaseRepository implements PaymentRefundRepositoryInterface
{
    protected function model(): PaymentRefund
    {
        return new PaymentRefund;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['paymentTransaction', 'customer', 'processedBy']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', (int) $filters['customer_id']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?PaymentRefund
    {
        return $this->model->with(['paymentTransaction', 'customer', 'processedBy'])->find($id);
    }

    public function findByUuid(string $uuid): ?PaymentRefund
    {
        return $this->model->with(['paymentTransaction', 'customer', 'processedBy'])
            ->where('uuid', $uuid)
            ->first();
    }

    public function create(array $data): PaymentRefund
    {
        return $this->model->create($data);
    }

    public function update(PaymentRefund $refund, array $data): PaymentRefund
    {
        $refund->update($data);

        return $refund->fresh();
    }

    public function updateStatus(PaymentRefund $refund, string $status): PaymentRefund
    {
        $refund->update(['status' => $status]);

        return $refund->fresh();
    }

    public function getTotalRefundedForPayment(int $paymentTransactionId): float
    {
        return (float) $this->model
            ->where('payment_transaction_id', $paymentTransactionId)
            ->where('status', 'processed')
            ->sum('refund_amount');
    }
}
