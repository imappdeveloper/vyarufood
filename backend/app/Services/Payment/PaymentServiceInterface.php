<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\PaymentTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PaymentServiceInterface
{
    public function getPaginatedPayments(array $filters, int $perPage): LengthAwarePaginator;

    public function getPaymentById(int $id): ?PaymentTransaction;

    public function getPaymentByUuid(string $uuid): ?PaymentTransaction;

    public function createPayment(array $data): PaymentTransaction;

    public function verifyPayment(
        string $gatewayOrderId,
        string $gatewayTransactionId,
        array $gatewayResponse,
    ): PaymentTransaction;

    public function markPaymentFailed(int $id, string $reason): PaymentTransaction;

    public function cancelPayment(int $id): PaymentTransaction;

    public function getDashboardStats(): array;

    public function getRevenueSummary(array $filters): array;

    public function getPaymentHistory(int $customerId, array $filters, int $perPage): LengthAwarePaginator;

    public function getWebhookLogs(array $filters, int $perPage): LengthAwarePaginator;
}
