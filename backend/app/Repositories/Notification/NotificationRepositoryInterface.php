<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function getPaginatedByRecipient(string $recipientType, int $recipientId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Notification;

    public function findByUuid(string $uuid): ?Notification;

    public function create(array $data): Notification;

    public function update(Notification $notification, array $data): Notification;

    public function updateStatus(Notification $notification, string $status): Notification;

    public function markAsRead(Notification $notification): Notification;

    public function getDashboardStats(): array;

    public function getDeliveryStats(array $filters = []): array;

    public function getUnreadCount(string $recipientType, int $recipientId): int;
}
