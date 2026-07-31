<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\PaymentWebhookLog;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaymentWebhookLogRepository extends BaseRepository implements PaymentWebhookLogRepositoryInterface
{
    protected function model(): PaymentWebhookLog
    {
        return new PaymentWebhookLog;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($filters['gateway_name'])) {
            $query->where('gateway_name', $filters['gateway_name']);
        }

        if (! empty($filters['event_name'])) {
            $query->where('event_name', $filters['event_name']);
        }

        if (! empty($filters['verification_status'])) {
            $query->where('verification_status', $filters['verification_status']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?PaymentWebhookLog
    {
        return $this->model->find($id);
    }

    public function create(array $data): PaymentWebhookLog
    {
        return $this->model->create($data);
    }

    public function update(PaymentWebhookLog $webhookLog, array $data): PaymentWebhookLog
    {
        $webhookLog->update($data);

        return $webhookLog->fresh();
    }
}
