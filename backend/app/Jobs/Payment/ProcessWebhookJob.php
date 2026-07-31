<?php

declare(strict_types=1);

namespace App\Jobs\Payment;

use App\Services\Payment\WebhookServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(
        public array $webhookData,
    ) {}

    public function handle(WebhookServiceInterface $webhookService): void
    {
        Log::info('Processing webhook', [
            'gateway' => $this->webhookData['gateway_name'] ?? 'unknown',
            'event' => $this->webhookData['event_name'] ?? 'unknown',
        ]);

        try {
            $webhookService->processWebhook($this->webhookData);

            Log::info('Webhook processed successfully');
        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'gateway' => $this->webhookData['gateway_name'] ?? 'unknown',
                'event' => $this->webhookData['event_name'] ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessWebhookJob permanently failed', [
            'gateway' => $this->webhookData['gateway_name'] ?? 'unknown',
            'event' => $this->webhookData['event_name'] ?? 'unknown',
            'error' => $exception->getMessage(),
        ]);
    }
}
