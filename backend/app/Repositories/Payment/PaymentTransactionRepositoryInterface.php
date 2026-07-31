<?php

declare(strict_types=1);

namespace App\Repositories\Payment;

use App\Models\PaymentTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PaymentTransactionRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getPaginatedByCustomer(int $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?PaymentTransaction;

    public function findByUuid(string $uuid): ?PaymentTransaction;

    public function findByGatewayOrderId(string $gatewayOrderId): ?PaymentTransaction;

    public function create(array $data): PaymentTransaction;

    public function update(PaymentTransaction $payment, array $data): PaymentTransaction;

    public function updateStatus(PaymentTransaction $payment, string $status): PaymentTransaction;

    public function getDashboardStats(): array;

    public function getRevenueSummary(array $filters): array;
}
