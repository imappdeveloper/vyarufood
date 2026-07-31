<?php

declare(strict_types=1);

namespace App\Services\Payment\Gateway;

interface PaymentGatewayInterface
{
    public function createOrder(float $amount, string $currency, array $metadata): array;

    public function verifyPayment(array $payload, string $signature): bool;

    public function processRefund(string $gatewayTransactionId, float $amount): array;

    public function getWebhookSecret(): string;
}
