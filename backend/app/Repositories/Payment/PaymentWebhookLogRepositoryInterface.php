<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\PaymentWebhookLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PaymentWebhookLogRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?PaymentWebhookLog;

    public function create(array $data): PaymentWebhookLog;

    public function update(PaymentWebhookLog $webhookLog, array $data): PaymentWebhookLog;
}
