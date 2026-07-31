<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\PaymentTransaction;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaymentTransactionRepository extends BaseRepository implements PaymentTransactionRepositoryInterface
{
    protected function model(): PaymentTransaction
    {
        return new PaymentTransaction;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()->with(['customer', 'order', 'subscription', 'refunds']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('transaction_number', 'LIKE', "%{$search}%")
                  ->orWhere('gateway_transaction_id', 'LIKE', "%{$search}%")
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

        if (! empty($filters['gateway_name'])) {
            $query->where('gateway_name', $filters['gateway_name']);
        }

        if (! empty($filters['payment_type'])) {
            $query->where('payment_type', $filters['payment_type']);
        }

        if (! empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getPaginatedByCustomer(int $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['order', 'subscription', 'refunds'])
            ->where('customer_id', $customerId);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?PaymentTransaction
    {
        return $this->model->with(['customer', 'order', 'subscription', 'refunds.processedBy', 'createdBy', 'updatedBy'])->find($id);
    }

    public function findByUuid(string $uuid): ?PaymentTransaction
    {
        return $this->model->with(['customer', 'order', 'subscription', 'refunds'])
            ->where('uuid', $uuid)
            ->first();
    }

    public function findByGatewayOrderId(string $gatewayOrderId): ?PaymentTransaction
    {
        return $this->model->where('gateway_order_id', $gatewayOrderId)->first();
    }

    public function create(array $data): PaymentTransaction
    {
        return $this->model->create($data);
    }

    public function update(PaymentTransaction $payment, array $data): PaymentTransaction
    {
        $payment->update($data);

        return $payment->fresh();
    }

    public function updateStatus(PaymentTransaction $payment, string $status): PaymentTransaction
    {
        $payment->update(['status' => $status]);

        return $payment->fresh();
    }

    public function getDashboardStats(): array
    {
        $query = $this->model->query();

        return [
            'total_payments' => (clone $query)->count(),
            'successful' => (clone $query)->where('status', 'success')->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'failed' => (clone $query)->where('status', 'failed')->count(),
            'refunded' => (clone $query)->where('status', 'refunded')->count(),
            'total_amount' => (float) (clone $query)->where('status', 'success')->sum('amount'),
            'today_count' => (clone $query)->whereDate('payment_date', now()->toDateString())->count(),
            'today_amount' => (float) (clone $query)->whereDate('payment_date', now()->toDateString())
                ->where('status', 'success')->sum('amount'),
        ];
    }

    public function getRevenueSummary(array $filters): array
    {
        $query = $this->model->query()->where('status', 'success');

        if (! empty($filters['start_date'])) {
            $query->whereDate('payment_date', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->whereDate('payment_date', '<=', $filters['end_date']);
        }

        $daily = $query->clone()
            ->selectRaw('DATE(payment_date) as date, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $byGateway = $this->model->query()
            ->where('status', 'success')
            ->selectRaw('gateway_name, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('gateway_name')
            ->get();

        $byMethod = $this->model->query()
            ->where('status', 'success')
            ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('payment_method')
            ->get();

        return [
            'daily' => $daily,
            'by_gateway' => $byGateway,
            'by_method' => $byMethod,
            'total_revenue' => (float) $this->model->where('status', 'success')->sum('amount'),
        ];
    }
}
