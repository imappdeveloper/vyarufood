<?php

declare(strict_types=1);

namespace App\Jobs\Notification;

use App\Models\Notification;
use App\Models\NotificationLog;
use App\Services\Notification\Channel\NotificationChannelInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(
        public Notification $notification,
    ) {}

    public function handle(NotificationChannelInterface $channelManager): void
    {
        Log::info('Processing SendNotificationJob', [
            'notification_id' => $this->notification->id,
            'notification_number' => $this->notification->notification_number,
            'channel' => $this->notification->channel,
        ]);

        try {
            $result = $channelManager->send(
                $this->notification->channel,
                [
                    'title' => $this->notification->title,
                    'message' => $this->notification->message,
                    'payload' => $this->notification->payload ?? [],
                    'recipient_type' => $this->notification->recipient_type,
                    'recipient_id' => $this->notification->recipient_id,
                ]
            );

            $this->notification->update([
                'delivery_status' => 'sent',
                'sent_at' => now(),
            ]);

            NotificationLog::create([
                'notification_id' => $this->notification->id,
                'provider' => $this->notification->channel,
                'provider_message_id' => $result['message_id'] ?? null,
                'request_payload' => [
                    'title' => $this->notification->title,
                    'message' => $this->notification->message,
                ],
                'response_payload' => $result,
                'status' => 'success',
                'sent_at' => now(),
            ]);

            Log::info('Notification sent successfully', [
                'notification_id' => $this->notification->id,
                'channel' => $this->notification->channel,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send notification', [
                'notification_id' => $this->notification->id,
                'channel' => $this->notification->channel,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->notification->update([
            'delivery_status' => 'failed',
            'failure_reason' => $exception->getMessage(),
        ]);

        NotificationLog::create([
            'notification_id' => $this->notification->id,
            'provider' => $this->notification->channel,
            'provider_message_id' => null,
            'request_payload' => [
                'title' => $this->notification->title,
                'message' => $this->notification->message,
            ],
            'response_payload' => ['error' => $exception->getMessage()],
            'status' => 'failed',
            'sent_at' => now(),
        ]);

        Log::error('SendNotificationJob permanently failed', [
            'notification_id' => $this->notification->id,
            'error' => $exception->getMessage(),
        ]);
    }

    public function retryUntil(): \DateTimeImmutable
    {
        return now()->addMinutes(10);
    }
}
