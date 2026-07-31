<?php

declare(strict_types=1);

namespace App\Jobs\Payment;

use App\Models\PaymentTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendPaymentNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 30;

    public function __construct(
        public PaymentTransaction $payment,
        public string $type,
    ) {}

    public function handle(): void
    {
        Log::info('Sending payment notification', [
            'payment_id' => $this->payment->id,
            'transaction_number' => $this->payment->transaction_number,
            'type' => $this->type,
            'amount' => $this->payment->amount,
            'customer_id' => $this->payment->customer_id,
        ]);

        try {
            match ($this->type) {
                'success' => $this->sendSuccessNotification(),
                'failed' => $this->sendFailedNotification(),
                'refund' => $this->sendRefundNotification(),
                default => Log::warning('Unknown notification type: ' . $this->type),
            };

            Log::info('Payment notification sent', [
                'payment_id' => $this->payment->id,
                'type' => $this->type,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payment notification', [
                'payment_id' => $this->payment->id,
                'type' => $this->type,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    protected function sendSuccessNotification(): void
    {
        Log::info('Payment success notification would be sent', [
            'to' => $this->payment->customer_id,
            'amount' => $this->payment->amount,
            'method' => $this->payment->payment_method,
        ]);
    }

    protected function sendFailedNotification(): void
    {
        Log::info('Payment failure notification would be sent', [
            'to' => $this->payment->customer_id,
            'amount' => $this->payment->amount,
            'reason' => $this->payment->failure_reason,
        ]);
    }

    protected function sendRefundNotification(): void
    {
        Log::info('Refund notification would be sent', [
            'to' => $this->payment->customer_id,
            'amount' => $this->payment->amount,
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('SendPaymentNotificationJob permanently failed', [
            'payment_id' => $this->payment->id,
            'type' => $this->type,
            'error' => $exception->getMessage(),
        ]);
    }
}
