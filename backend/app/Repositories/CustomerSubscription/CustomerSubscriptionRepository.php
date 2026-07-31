<?php

declare(strict_types=1);

namespace App\Repositories\CustomerSubscription;

use App\Models\CustomerSubscription;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerSubscriptionRepository extends BaseRepository implements CustomerSubscriptionRepositoryInterface
{
    protected function model(): CustomerSubscription
    {
        return new CustomerSubscription;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['customer', 'subscriptionPlan', 'kitchen', 'mealCategory']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('subscription_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('customer', fn ($cq) => $cq->where('first_name', 'LIKE', "%{$search}%")->orWhere('last_name', 'LIKE', "%{$search}%")->orWhere('email', 'LIKE', "%{$search}%"));
            });
        }

        if (! empty($filters['subscription_status'])) {
            $query->where('subscription_status', $filters['subscription_status']);
        }

        if (! empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', (int) $filters['customer_id']);
        }

        if (! empty($filters['subscription_plan_id'])) {
            $query->where('subscription_plan_id', (int) $filters['subscription_plan_id']);
        }

        if (! empty($filters['kitchen_id'])) {
            $query->where('kitchen_id', (int) $filters['kitchen_id']);
        }

        if (! empty($filters['billing_cycle'])) {
            $query->where('billing_cycle', $filters['billing_cycle']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('start_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('end_date', '<=', $filters['date_to']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->query()
            ->with(['customer', 'subscriptionPlan', 'kitchen'])
            ->where('subscription_status', 'active')
            ->get();
    }

    public function getById(int $id): ?CustomerSubscription
    {
        return $this->model->with([
            'customer', 'subscriptionPlan.planMeals', 'kitchen', 'mealCategory',
            'pauseHistory', 'skipHistory', 'upgradeHistory.fromPlan', 'upgradeHistory.toPlan',
            'renewHistory', 'statusHistory.changedBy', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?CustomerSubscription
    {
        return $this->model->where('uuid', $uuid)
            ->with([
                'customer', 'subscriptionPlan.planMeals', 'kitchen', 'mealCategory',
                'pauseHistory.approvedBy', 'skipHistory.meal', 'upgradeHistory.fromPlan',
                'upgradeHistory.toPlan', 'upgradeHistory.approvedBy', 'renewHistory.fromPlan',
                'renewHistory.toPlan', 'statusHistory.changedBy', 'createdBy', 'updatedBy',
            ])
            ->first();
    }

    public function getByCustomer(int $customerId, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->where('customer_id', $customerId)
            ->with(['subscriptionPlan', 'kitchen']);

        if (! empty($filters['subscription_status'])) {
            $query->where('subscription_status', $filters['subscription_status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): CustomerSubscription
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?CustomerSubscription
    {
        $sub = $this->model->find($id);

        if (! $sub) {
            return null;
        }

        $sub->update($data);

        return $sub->fresh();
    }

    public function delete(int $id): bool
    {
        $sub = $this->model->find($id);

        if (! $sub) {
            return false;
        }

        return $sub->delete();
    }

    public function restore(int $id): bool
    {
        $sub = $this->model->withTrashed()->find($id);

        if (! $sub) {
            return false;
        }

        return $sub->restore();
    }

    public function forceDelete(int $id): bool
    {
        $sub = $this->model->withTrashed()->find($id);

        if (! $sub) {
            return false;
        }

        return $sub->forceDelete();
    }

    public function getStats(): array
    {
        $query = $this->model->query();

        return [
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('subscription_status', 'pending')->count(),
            'active' => (clone $query)->where('subscription_status', 'active')->count(),
            'paused' => (clone $query)->where('subscription_status', 'paused')->count(),
            'expired' => (clone $query)->where('subscription_status', 'expired')->count(),
            'cancelled' => (clone $query)->where('subscription_status', 'cancelled')->count(),
            'completed' => (clone $query)->where('subscription_status', 'completed')->count(),
            'suspended' => (clone $query)->where('subscription_status', 'suspended')->count(),
        ];
    }

    public function getDashboardStats(): array
    {
        $stats = $this->getStats();
        $stats['total_revenue'] = (float) $this->model->where('payment_status', 'paid')->sum('wallet_adjustment');
        $stats['pending_payments'] = (float) $this->model->where('payment_status', 'pending')->sum('wallet_adjustment');
        $stats['total_refunded'] = (float) $this->model->where('payment_status', 'refunded')->sum('refund_amount');
        $stats['expiring_this_week'] = $this->model->where('subscription_status', 'active')
            ->whereBetween('end_date', [now(), now()->addWeek()])
            ->count();
        $stats['pending_renewals'] = $this->model->where('auto_renew', true)
            ->where('subscription_status', 'active')
            ->where('end_date', '<=', now()->addDays(3))
            ->count();

        return $stats;
    }

    public function getPendingRenewals(): Collection
    {
        return $this->model->where('auto_renew', true)
            ->where('subscription_status', 'active')
            ->where('end_date', '<=', now()->addDays(3))
            ->with(['customer', 'subscriptionPlan'])
            ->get();
    }

    public function getExpiringSoon(int $days = 3): Collection
    {
        return $this->model->where('subscription_status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays($days)])
            ->with(['customer', 'subscriptionPlan'])
            ->get();
    }

    public function generateSubscriptionNumber(): string
    {
        $last = $this->model->orderBy('id', 'desc')->first();
        $nextNumber = $last ? $last->id + 1 : 1;

        return 'SUB-' . str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
