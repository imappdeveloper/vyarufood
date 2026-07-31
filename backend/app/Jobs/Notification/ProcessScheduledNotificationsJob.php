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

class ProcessScheduledNotificationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 120;

    public function __construct() {}

    public function handle(): void
    {
        Log::info('Processing ProcessScheduledNotificationsJob');

        $scheduledNotifications = Notification::where('delivery_status', 'pending')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->get();

        foreach ($scheduledNotifications as $notification) {
            SendNotificationJob::dispatch($notification);
        }

        Log::info('Scheduled notifications dispatched', [
            'count' => $scheduledNotifications->count(),
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessScheduledNotificationsJob failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
