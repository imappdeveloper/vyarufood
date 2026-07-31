<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\NotificationLog;
use App\Models\NotificationPreference;
use App\Models\NotificationTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedTemplates();
        $this->seedNotifications();
        $this->seedLogs();
        $this->seedPreferences();
    }

    protected function seedTemplates(): void
    {
        $templates = [
            [
                'template_code' => 'order.placed',
                'template_name' => 'Order Placed',
                'notification_type' => 'transactional',
                'channel' => 'push',
                'subject' => 'Order Confirmed',
                'title' => 'Order #{order_number} Placed',
                'message' => 'Your order #{order_number} has been placed successfully. Total: {total_amount}. Expected delivery: {delivery_date}.',
                'variables' => ['order_number', 'total_amount', 'delivery_date'],
                'status' => 'active',
            ],
            [
                'template_code' => 'order.confirmed',
                'template_name' => 'Order Confirmed',
                'notification_type' => 'transactional',
                'channel' => 'push',
                'subject' => 'Order Confirmed',
                'title' => 'Order #{order_number} Confirmed',
                'message' => 'Great news! Your order #{order_number} has been confirmed and is being prepared.',
                'variables' => ['order_number'],
                'status' => 'active',
            ],
            [
                'template_code' => 'order.delivered',
                'template_name' => 'Order Delivered',
                'notification_type' => 'transactional',
                'channel' => 'push',
                'subject' => 'Order Delivered',
                'title' => 'Order #{order_number} Delivered',
                'message' => 'Your order #{order_number} has been delivered. We hope you enjoy your meal! Please rate your experience.',
                'variables' => ['order_number'],
                'status' => 'active',
            ],
            [
                'template_code' => 'order.cancelled',
                'template_name' => 'Order Cancelled',
                'notification_type' => 'transactional',
                'channel' => 'email',
                'subject' => 'Order Cancelled - {order_number}',
                'title' => 'Order #{order_number} Cancelled',
                'message' => 'Your order #{order_number} has been cancelled. Refund of {refund_amount} will be processed within 3-5 business days.',
                'variables' => ['order_number', 'refund_amount'],
                'status' => 'active',
            ],
            [
                'template_code' => 'subscription.created',
                'template_name' => 'Subscription Created',
                'notification_type' => 'transactional',
                'channel' => 'email',
                'subject' => 'Welcome to Your Subscription!',
                'title' => 'Subscription Activated',
                'message' => 'Your {plan_name} subscription has been activated! Your first delivery starts on {start_date}. Enjoy {meal_count} meals daily.',
                'variables' => ['plan_name', 'start_date', 'meal_count'],
                'status' => 'active',
            ],
            [
                'template_code' => 'subscription.renewed',
                'template_name' => 'Subscription Renewed',
                'notification_type' => 'transactional',
                'channel' => 'push',
                'subject' => 'Subscription Renewed',
                'title' => 'Subscription Renewed Successfully',
                'message' => 'Your {plan_name} subscription has been renewed for {duration}. Next renewal date: {renewal_date}.',
                'variables' => ['plan_name', 'duration', 'renewal_date'],
                'status' => 'active',
            ],
            [
                'template_code' => 'payment.success',
                'template_name' => 'Payment Success',
                'notification_type' => 'transactional',
                'channel' => 'push',
                'subject' => 'Payment Successful',
                'title' => 'Payment of {amount} Received',
                'message' => 'Your payment of {amount} via {payment_method} was successful. Transaction ID: {transaction_id}.',
                'variables' => ['amount', 'payment_method', 'transaction_id'],
                'status' => 'active',
            ],
            [
                'template_code' => 'payment.failed',
                'template_name' => 'Payment Failed',
                'notification_type' => 'transactional',
                'channel' => 'email',
                'subject' => 'Payment Failed',
                'title' => 'Payment of {amount} Failed',
                'message' => 'Your payment of {amount} failed. Reason: {failure_reason}. Please retry or use a different payment method.',
                'variables' => ['amount', 'failure_reason'],
                'status' => 'active',
            ],
            [
                'template_code' => 'wallet.recharged',
                'template_name' => 'Wallet Recharged',
                'notification_type' => 'transactional',
                'channel' => 'push',
                'subject' => 'Wallet Recharged',
                'title' => 'Wallet Credited with {amount}',
                'message' => 'Your wallet has been recharged with {amount}. New balance: {new_balance}.',
                'variables' => ['amount', 'new_balance'],
                'status' => 'active',
            ],
            [
                'template_code' => 'system.announcement',
                'template_name' => 'System Announcement',
                'notification_type' => 'system',
                'channel' => 'in_app',
                'subject' => 'System Announcement',
                'title' => '{announcement_title}',
                'message' => '{announcement_message}',
                'variables' => ['announcement_title', 'announcement_message'],
                'status' => 'active',
            ],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['template_code' => $template['template_code']],
                array_merge($template, [
                    'uuid' => Str::uuid()->toString(),
                    'language' => 'en',
                ])
            );
        }

        $this->command->info('Notification templates seeded (' . count($templates) . ' records).');
    }

    protected function seedNotifications(): void
    {
        $customer = \App\Models\Customer::first();

        if (! $customer) {
            $this->command->warn('No customers found. Skipping notification seeding.');
            return;
        }

        $notifications = [
            [
                'notification_number' => 'NOTIF-' . strtoupper(Str::random(10)),
                'recipient_type' => 'Customer',
                'recipient_id' => $customer->id,
                'event_name' => 'order.placed',
                'channel' => 'push',
                'title' => 'Order #ORD-001 Placed',
                'message' => 'Your order #ORD-001 has been placed successfully. Total: ₹250.00.',
                'priority' => 'normal',
                'delivery_status' => 'sent',
                'sent_at' => now()->subHours(2),
            ],
            [
                'notification_number' => 'NOTIF-' . strtoupper(Str::random(10)),
                'recipient_type' => 'Customer',
                'recipient_id' => $customer->id,
                'event_name' => 'payment.success',
                'channel' => 'email',
                'title' => 'Payment of ₹250.00 Received',
                'message' => 'Your payment of ₹250.00 via UPI was successful. Transaction ID: TXN-001.',
                'priority' => 'normal',
                'delivery_status' => 'delivered',
                'sent_at' => now()->subHours(1),
            ],
            [
                'notification_number' => 'NOTIF-' . strtoupper(Str::random(10)),
                'recipient_type' => 'Customer',
                'recipient_id' => $customer->id,
                'event_name' => 'subscription.renewed',
                'channel' => 'whatsapp',
                'title' => 'Subscription Renewed Successfully',
                'message' => 'Your Premium plan subscription has been renewed for 30 days.',
                'priority' => 'high',
                'delivery_status' => 'pending',
                'sent_at' => null,
            ],
            [
                'notification_number' => 'NOTIF-' . strtoupper(Str::random(10)),
                'recipient_type' => 'Customer',
                'recipient_id' => $customer->id,
                'event_name' => 'order.delivered',
                'channel' => 'sms',
                'title' => 'Order Delivered',
                'message' => 'Your order #ORD-002 has been delivered. Enjoy your meal!',
                'priority' => 'normal',
                'delivery_status' => 'failed',
                'failure_reason' => 'Invalid phone number format',
                'sent_at' => null,
            ],
            [
                'notification_number' => 'NOTIF-' . strtoupper(Str::random(10)),
                'recipient_type' => 'Customer',
                'recipient_id' => $customer->id,
                'event_name' => 'system.announcement',
                'channel' => 'in_app',
                'title' => 'Maintenance Scheduled',
                'message' => 'Our app will undergo maintenance on Sunday from 2 AM to 4 AM.',
                'priority' => 'low',
                'delivery_status' => 'read',
                'sent_at' => now()->subDays(1),
                'read_at' => now()->subHours(20),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create(array_merge($notification, [
                'uuid' => Str::uuid()->toString(),
                'scheduled_at' => null,
                'payload' => null,
            ]));
        }

        $this->command->info('Notifications seeded (' . count($notifications) . ' records).');
    }

    protected function seedLogs(): void
    {
        $sentNotification = Notification::where('delivery_status', 'sent')->first();
        $deliveredNotification = Notification::where('delivery_status', 'delivered')->first();
        $failedNotification = Notification::where('delivery_status', 'failed')->first();

        $logs = [];

        if ($sentNotification) {
            $logs[] = [
                'uuid' => Str::uuid()->toString(),
                'notification_id' => $sentNotification->id,
                'provider' => 'fcm',
                'provider_message_id' => 'msg_' . Str::random(16),
                'request_payload' => ['title' => $sentNotification->title, 'body' => $sentNotification->message],
                'response_payload' => ['success' => true, 'message_id' => 'msg_' . Str::random(16)],
                'status' => 'success',
                'sent_at' => $sentNotification->sent_at,
            ];
        }

        if ($deliveredNotification) {
            $logs[] = [
                'uuid' => Str::uuid()->toString(),
                'notification_id' => $deliveredNotification->id,
                'provider' => 'smtp',
                'provider_message_id' => 'email_' . Str::random(16),
                'request_payload' => ['to' => 'customer@example.com', 'subject' => $deliveredNotification->title],
                'response_payload' => ['status' => 'delivered', 'provider' => 'smtp'],
                'status' => 'success',
                'sent_at' => $deliveredNotification->sent_at,
            ];
        }

        if ($failedNotification) {
            $logs[] = [
                'uuid' => Str::uuid()->toString(),
                'notification_id' => $failedNotification->id,
                'provider' => 'twilio',
                'provider_message_id' => null,
                'request_payload' => ['to' => '+910000000000', 'body' => $failedNotification->message],
                'response_payload' => ['error' => 'Invalid phone number format'],
                'status' => 'failed',
                'sent_at' => now(),
            ];
        }

        foreach ($logs as $log) {
            NotificationLog::create($log);
        }

        $this->command->info('Notification logs seeded (' . count($logs) . ' records).');
    }

    protected function seedPreferences(): void
    {
        $customer = \App\Models\Customer::first();

        if (! $customer) {
            $this->command->warn('No customers found. Skipping preference seeding.');
            return;
        }

        NotificationPreference::updateOrCreate(
            ['customer_id' => $customer->id],
            [
                'uuid' => Str::uuid()->toString(),
                'push_enabled' => true,
                'email_enabled' => true,
                'sms_enabled' => true,
                'marketing_enabled' => false,
                'order_enabled' => true,
                'payment_enabled' => true,
                'subscription_enabled' => true,
                'system_enabled' => true,
                'language' => 'en',
            ]
        );

        $this->command->info('Notification preferences seeded for customer_id=' . $customer->id);
    }
}
