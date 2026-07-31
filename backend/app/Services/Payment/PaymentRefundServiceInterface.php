<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\PaymentRefund;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PaymentRefundServiceInterface
{
    public function getPaginatedRefunds(array $filters, int $perPage): LengthAwarePaginator;

    public function getRefundById(int $id): ?PaymentRefund;

    public function getRefundByUuid(string $uuid): ?PaymentRefund;

    public function processRefund(array $data): PaymentRefund;

    public function updateRefundStatus(int $id, string $status): PaymentRefund;
}
