<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\PaymentWebhookLog;
use App\Repositories\Payment\PaymentWebhookLogRepositoryInterface;
use App\Support\BaseService;

class WebhookService extends BaseService implements WebhookServiceInterface
{
    protected string $moduleName = 'webhook';

    public function __construct(
        protected PaymentWebhookLogRepositoryInterface $webhookLogRepo,
        protected PaymentServiceInterface $paymentService,
    ) {}

    public function processWebhook(array $data): PaymentWebhookLog
    {
        return $this->transaction(function () use ($data) {
            $webhookLog = $this->webhookLogRepo->create([
                'gateway_name' => $data['gateway_name'],
                'event_name' => $data['event_name'],
                'payload' => $data['payload'],
                'signature' => $data['signature'] ?? null,
                'verification_status' => false,
                'processed_at' => null,
            ]);

            $verified = $this->verifyWebhookSignature(
                $data['gateway_name'],
                is_string($data['payload']) ? $data['payload'] : json_encode($data['payload']),
                $data['signature'] ?? '',
            );

            $this->webhookLogRepo->update($webhookLog, [
                'verification_status' => $verified,
            ]);

            if ($verified) {
                $this->handleWebhookEvent($data['gateway_name'], $data['event_name'], $data['payload']);

                $this->webhookLogRepo->update($webhookLog, [
                    'processed_at' => now(),
                ]);
            }

            $this->logInfo('Webhook processed', [
                'gateway' => $data['gateway_name'],
                'event' => $data['event_name'],
                'verified' => $verified,
            ]);

            return $webhookLog;
        });
    }

    public function verifyWebhookSignature(string $gateway, string $payload, string $signature): bool
    {
        if (empty($signature)) {
            return false;
        }

        if ($gateway === 'razorpay') {
            $secret = config('razorpay.webhook_secret', '');
            $expectedSignature = hash_hmac('sha256', $payload, $secret);
            return hash_equals($expectedSignature, $signature);
        }

        $this->logWarning('Unknown gateway for signature verification', ['gateway' => $gateway]);

        return false;
    }

    protected function handleWebhookEvent(string $gateway, string $eventName, array $payload): void
    {
        if (in_array($eventName, ['payment.captured', 'payment.authorized'])) {
            $gatewayOrderId = $payload['payload']['payment']['entity']['order_id'] ?? null;
            $gatewayTransactionId = $payload['payload']['payment']['entity']['id'] ?? null;

            if ($gatewayOrderId && $gatewayTransactionId) {
                $this->paymentService->verifyPayment($gatewayOrderId, $gatewayTransactionId, $payload);
            }
        }

        if ($eventName === 'payment.failed') {
            $gatewayOrderId = $payload['payload']['payment']['entity']['order_id'] ?? null;
            $reason = $payload['payload']['payment']['entity']['error_description'] ?? 'Payment failed via webhook';

            if ($gatewayOrderId) {
                $payment = $this->paymentService->getPaymentByUuid($gatewayOrderId);
                if ($payment) {
                    $this->paymentService->markPaymentFailed($payment->id, $reason);
                }
            }
        }
    }
}
