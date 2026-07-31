<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\PaymentWebhookLog;

interface WebhookServiceInterface
{
    public function processWebhook(array $data): PaymentWebhookLog;

    public function verifyWebhookSignature(string $gateway, string $payload, string $signature): bool;
}
