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

class RetryFailedNotificationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 120;

    public function __construct() {}

    public function handle(): void
    {
        Log::info('Processing RetryFailedNotificationsJob');

        $failedNotifications = Notification::where('delivery_status', 'failed')
            ->where('created_at', '>=', now()->subDays(7))
            ->get();

        foreach ($failedNotifications as $notification) {
            $notification->update([
                'delivery_status' => 'pending',
                'failure_reason' => null,
            ]);

            SendNotificationJob::dispatch($notification);
        }

        Log::info('Retry failed notifications dispatched', [
            'count' => $failedNotifications->count(),
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('RetryFailedNotificationsJob failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
