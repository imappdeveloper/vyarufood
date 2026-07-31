<?php

declare(strict_types=1);

namespace App\Services\Payment\Gateway;

class RazorpayGateway implements PaymentGatewayInterface
{
    public function __construct()
    {
        $this->config = config('razorpay', []);
    }

    public function createOrder(float $amount, string $currency, array $metadata): array
    {
        $amountInPaise = (int) ($amount * 100);

        return [
            'id' => 'order_' . bin2hex(random_bytes(8)),
            'entity' => 'order',
            'amount' => $amountInPaise,
            'amount_paid' => 0,
            'amount_due' => $amountInPaise,
            'currency' => $currency,
            'receipt' => $metadata['receipt'] ?? null,
            'status' => 'created',
            'created_at' => now()->timestamp,
        ];
    }

    public function verifyPayment(array $payload, string $signature): bool
    {
        $secret = $this->getWebhookSecret();

        if (empty($secret) || empty($signature)) {
            return false;
        }

        $body = json_encode($payload);
        $expectedSignature = hash_hmac('sha256', $body, $secret);

        return hash_equals($expectedSignature, $signature);
    }

    public function processRefund(string $gatewayTransactionId, float $amount): array
    {
        $amountInPaise = (int) ($amount * 100);

        return [
            'id' => 'refund_' . bin2hex(random_bytes(8)),
            'entity' => 'refund',
            'amount' => $amountInPaise,
            'currency' => 'INR',
            'payment_id' => $gatewayTransactionId,
            'status' => 'processed',
            'created_at' => now()->timestamp,
        ];
    }

    public function getWebhookSecret(): string
    {
        return config('razorpay.webhook_secret', '');
    }
}
