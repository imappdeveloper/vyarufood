<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\PaymentRefund;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PaymentRefundRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?PaymentRefund;

    public function findByUuid(string $uuid): ?PaymentRefund;

    public function create(array $data): PaymentRefund;

    public function update(PaymentRefund $refund, array $data): PaymentRefund;

    public function updateStatus(PaymentRefund $refund, string $status): PaymentRefund;

    public function getTotalRefundedForPayment(int $paymentTransactionId): float;
}
