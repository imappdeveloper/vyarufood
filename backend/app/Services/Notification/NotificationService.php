<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\Notification;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Repositories\Notification\NotificationTemplateRepositoryInterface;
use App\Repositories\Notification\NotificationPreferenceRepositoryInterface;
use App\Services\Notification\Channel\NotificationChannelManager;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class NotificationService extends BaseService implements NotificationServiceInterface
{
    protected string $moduleName = 'notification';

    public function __construct(
        protected readonly NotificationRepositoryInterface $notificationRepo,
        protected readonly NotificationTemplateRepositoryInterface $templateRepo,
        protected readonly NotificationPreferenceRepositoryInterface $preferenceRepo,
        protected readonly NotificationChannelManager $channelManager,
    ) {}

    public function getPaginatedNotifications(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->notificationRepo->getPaginated($filters, $perPage);
    }

    public function getNotificationById(int $id): ?Notification
    {
        return $this->notificationRepo->findById($id);
    }

    public function getNotificationByUuid(string $uuid): ?Notification
    {
        return $this->notificationRepo->findByUuid($uuid);
    }

    public function sendNotification(array $data): Notification
    {
        return $this->transaction(function () use ($data) {
            $uuid = $data['uuid'] ?? (string) Str::uuid();
            $notificationNumber = $this->generateNotificationNumber();

            $notificationData = array_merge($data, [
                'notification_number' => $notificationNumber,
                'uuid' => $uuid,
                'delivery_status' => 'pending',
            ]);

            $notification = $this->notificationRepo->create($notificationData);

            $this->dispatchSendJob($notification);

            $this->logInfo('Notification created and queued', [
                'notification_id' => $notification->id,
                'channel' => $notification->channel,
                'recipient_type' => $notification->recipient_type,
                'recipient_id' => $notification->recipient_id,
            ]);

            $this->logActivity('notification_sent', $notification);

            return $notification;
        });
    }

    public function sendBulkNotification(array $data): array
    {
        return $this->transaction(function () use ($data) {
            $recipientIds = $data['recipient_ids'] ?? [];
            $createdNotifications = [];

            foreach ($recipientIds as $recipientId) {
                $recipientType = $data['recipient_type'] ?? 'customer';
                $uuid = (string) Str::uuid();

                $notificationData = array_merge($data, [
                    'notification_number' => $this->generateNotificationNumber(),
                    'uuid' => $uuid,
                    'recipient_type' => $recipientType,
                    'recipient_id' => $recipientId,
                    'delivery_status' => 'pending',
                ]);

                unset($notificationData['recipient_ids']);

                $notification = $this->notificationRepo->create($notificationData);

                $this->dispatchSendJob($notification);

                $createdNotifications[] = $notification;
            }

            $this->logInfo('Bulk notifications created', [
                'count' => count($createdNotifications),
                'channel' => $data['channel'] ?? null,
            ]);

            return $createdNotifications;
        });
    }

    public function broadcastMessage(array $data): int
    {
        return $this->transaction(function () use ($data) {
            $recipientIds = $data['recipient_ids'] ?? [];
            $count = 0;

            foreach ($recipientIds as $recipientId) {
                $recipientType = $data['recipient_type'] ?? 'customer';
                $uuid = (string) Str::uuid();

                $notificationData = array_merge($data, [
                    'notification_number' => $this->generateNotificationNumber(),
                    'uuid' => $uuid,
                    'recipient_type' => $recipientType,
                    'recipient_id' => $recipientId,
                    'delivery_status' => 'pending',
                    'event_name' => 'broadcast',
                ]);

                unset($notificationData['recipient_ids']);

                $notification = $this->notificationRepo->create($notificationData);

                $this->dispatchSendJob($notification);

                $count++;
            }

            $this->logInfo('Broadcast message sent', [
                'recipients_count' => $count,
                'title' => $data['title'] ?? null,
            ]);

            return $count;
        });
    }

    public function markAsRead(string $uuid): Notification
    {
        $notification = $this->notificationRepo->findByUuid($uuid);

        if (! $notification) {
            throw new \InvalidArgumentException("Notification not found with UUID: {$uuid}");
        }

        $updated = $this->notificationRepo->markAsRead($notification);

        $this->logInfo('Notification marked as read', ['uuid' => $uuid]);

        return $updated;
    }

    public function markAllAsRead(string $recipientType, int $recipientId): int
    {
        return $this->transaction(function () use ($recipientType, $recipientId) {
            $notifications = \App\Models\Notification::query()
                ->where('recipient_type', $recipientType)
                ->where('recipient_id', $recipientId)
                ->where('delivery_status', '!=', 'read')
                ->whereNull('read_at')
                ->get();

            $count = 0;

            foreach ($notifications as $notification) {
                $this->notificationRepo->markAsRead($notification);
                $count++;
            }

            $this->logInfo('All notifications marked as read', [
                'recipient_type' => $recipientType,
                'recipient_id' => $recipientId,
                'count' => $count,
            ]);

            return $count;
        });
    }

    public function getDashboardStats(): array
    {
        return $this->notificationRepo->getDashboardStats();
    }

    public function getDeliveryStats(array $filters = []): array
    {
        return $this->notificationRepo->getDeliveryStats($filters);
    }

    public function getUnreadCount(string $recipientType, int $recipientId): int
    {
        return $this->notificationRepo->getUnreadCount($recipientType, $recipientId);
    }

    public function cancelNotification(string $uuid): Notification
    {
        return $this->transaction(function () use ($uuid) {
            $notification = $this->notificationRepo->findByUuid($uuid);

            if (! $notification) {
                throw new \InvalidArgumentException("Notification not found with UUID: {$uuid}");
            }

            $updated = $this->notificationRepo->updateStatus($notification, 'cancelled');

            $this->logInfo('Notification cancelled', ['uuid' => $uuid]);

            return $updated;
        });
    }

    public function getCustomerNotifications(int $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->notificationRepo->getPaginatedByRecipient('customer', $customerId, $filters, $perPage);
    }

    private function dispatchSendJob(Notification $notification): void
    {
        try {
            if (class_exists(\App\Jobs\SendNotificationJob::class)) {
                dispatch(new \App\Jobs\SendNotificationJob($notification));
            } else {
                $this->processNotificationDirectly($notification);
            }
        } catch (\Exception $e) {
            $this->logWarning('Failed to dispatch notification job, processing directly', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);

            $this->processNotificationDirectly($notification);
        }
    }

    private function processNotificationDirectly(Notification $notification): void
    {
        try {
            $this->notificationRepo->updateStatus($notification, 'sending');

            $result = $this->channelManager->send($notification->channel, [
                'title' => $notification->title,
                'message' => $notification->message,
                'email' => $notification->recipient_email ?? null,
                'phone' => $notification->recipient_phone ?? null,
                'fcm_token' => $notification->fcm_token ?? null,
                'payload' => $notification->data ?? [],
            ]);

            if ($result['success']) {
                $this->notificationRepo->update($notification, [
                    'delivery_status' => 'sent',
                    'provider_message_id' => $result['provider_message_id'] ?? null,
                    'sent_at' => now(),
                ]);
            } else {
                $this->notificationRepo->update($notification, [
                    'delivery_status' => 'failed',
                    'error_message' => $result['error'] ?? 'Unknown error',
                    'failed_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            $this->logError('Notification processing failed', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);

            $this->notificationRepo->update($notification, [
                'delivery_status' => 'failed',
                'error_message' => $e->getMessage(),
                'failed_at' => now(),
            ]);
        }
    }

    private function generateNotificationNumber(): string
    {
        $lastNumber = \App\Models\Notification::query()
            ->orderBy('id', 'desc')
            ->value('notification_number');

        $nextNumber = 1;

        if ($lastNumber && preg_match('/NTF-(\d+)/', $lastNumber, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        }

        return 'NTF-' . str_pad((string) $nextNumber, 8, '0', STR_PAD_LEFT);
    }
}
