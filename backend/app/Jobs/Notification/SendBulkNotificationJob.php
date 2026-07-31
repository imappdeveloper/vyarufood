<?php

declare(strict_types=1);

namespace App\Jobs\Notification;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendBulkNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    public function __construct(
        public array $notificationData,
    ) {}

    public function handle(): void
    {
        Log::info('Processing SendBulkNotificationJob', [
            'count' => count($this->notificationData),
        ]);

        foreach ($this->notificationData as $item) {
            $notification = is_numeric($item)
                ? Notification::find($item)
                : Notification::find($item['id'] ?? null);

            if ($notification) {
                SendNotificationJob::dispatch($notification);
            }
        }

        Log::info('Bulk notification jobs dispatched', [
            'count' => count($this->notificationData),
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('SendBulkNotificationJob failed', [
            'error' => $exception->getMessage(),
        ]);
    }

    public function retryUntil(): \DateTimeImmutable
    {
        return now()->addMinutes(10);
    }
}
