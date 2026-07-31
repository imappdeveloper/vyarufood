<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\CustomerSubscription;
use App\Models\Notification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NotificationDailyReminder extends Command
{
    protected $signature = 'notifications:daily-reminder';

    protected $description = 'Send daily meal reminders to active subscribers';

    public function handle(): int
    {
        Log::info('Processing daily meal reminders');

        $activeSubscriptions = CustomerSubscription::where('status', 'active')
            ->whereHas('customer', function ($query) {
                $query->where('status', 'active');
            })
            ->get();

        $count = 0;

        foreach ($activeSubscriptions as $subscription) {
            Notification::create([
                'notification_number' => 'NOTIF-' . strtoupper(Str::random(10)),
                'recipient_type' => 'Customer',
                'recipient_id' => $subscription->customer_id,
                'template_id' => null,
                'event_name' => 'subscription.daily_reminder',
                'channel' => 'push',
                'title' => 'Daily Meal Reminder',
                'message' => 'Your meals for tomorrow are being prepared. Please check your meal selections.',
                'payload' => [
                    'subscription_id' => $subscription->id,
                    'customer_id' => $subscription->customer_id,
                ],
                'priority' => 'normal',
                'delivery_status' => 'pending',
                'scheduled_at' => now(),
            ]);

            $count++;
        }

        Log::info('Daily meal reminders created', ['count' => $count]);

        $this->info("Daily meal reminders sent to {$count} active subscribers.");

        return Command::SUCCESS;
    }
}
