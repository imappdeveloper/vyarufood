<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationServiceInterface
{
    public function getPaginatedNotifications(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getNotificationById(int $id): ?Notification;

    public function getNotificationByUuid(string $uuid): ?Notification;

    public function sendNotification(array $data): Notification;

    public function sendBulkNotification(array $data): array;

    public function broadcastMessage(array $data): int;

    public function markAsRead(string $uuid): Notification;

    public function markAllAsRead(string $recipientType, int $recipientId): int;

    public function getDashboardStats(): array;

    public function getDeliveryStats(array $filters = []): array;

    public function getUnreadCount(string $recipientType, int $recipientId): int;

    public function cancelNotification(string $uuid): Notification;

    public function getCustomerNotifications(int $customerId, array $filters = [], int $perPage = 15): LengthAwarePaginator;
}
