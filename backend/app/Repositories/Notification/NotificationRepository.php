<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\Notification;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationRepository extends BaseRepository implements NotificationRepositoryInterface
{
    protected function model(): Notification
    {
        return new Notification;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('notification_number', 'LIKE', "%{$search}%")
                    ->orWhere('title', 'LIKE', "%{$search}%")
                    ->orWhere('message', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['channel'])) {
            $query->where('channel', $filters['channel']);
        }

        if (! empty($filters['delivery_status'])) {
            $query->where('delivery_status', $filters['delivery_status']);
        }

        if (! empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (! empty($filters['recipient_type'])) {
            $query->where('recipient_type', $filters['recipient_type']);
        }

        if (! empty($filters['event_name'])) {
            $query->where('event_name', $filters['event_name']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getPaginatedByRecipient(string $recipientType, int $recipientId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->where('recipient_type', $recipientType)
            ->where('recipient_id', $recipientId);

        if (! empty($filters['status'])) {
            $query->where('delivery_status', $filters['status']);
        }

        if (! empty($filters['event_name'])) {
            $query->where('event_name', $filters['event_name']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?Notification
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Notification
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function create(array $data): Notification
    {
        return $this->model->create($data);
    }

    public function update(Notification $notification, array $data): Notification
    {
        $notification->update($data);

        return $notification->fresh();
    }

    public function updateStatus(Notification $notification, string $status): Notification
    {
        $notification->update([
            'delivery_status' => $status,
        ]);

        return $notification->fresh();
    }

    public function markAsRead(Notification $notification): Notification
    {
        $notification->update([
            'delivery_status' => 'read',
            'read_at' => now(),
        ]);

        return $notification->fresh();
    }

    public function getDashboardStats(): array
    {
        $query = $this->model->query();
        $today = now()->toDateString();

        return [
            'total_notifications' => (clone $query)->count(),
            'sent' => (clone $query)->where('delivery_status', 'sent')->count(),
            'delivered' => (clone $query)->where('delivery_status', 'delivered')->count(),
            'failed' => (clone $query)->where('delivery_status', 'failed')->count(),
            'pending' => (clone $query)->where('delivery_status', 'pending')->count(),
            'read' => (clone $query)->where('delivery_status', 'read')->count(),
            'today_count' => (clone $query)->whereDate('created_at', $today)->count(),
            'today_sent' => (clone $query)->whereDate('created_at', $today)->where('delivery_status', 'sent')->count(),
        ];
    }

    public function getDeliveryStats(array $filters = []): array
    {
        $query = $this->model->query()
            ->selectRaw('channel, delivery_status, COUNT(*) as count')
            ->groupBy('channel', 'delivery_status');

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        return $query->get()->toArray();
    }

    public function getUnreadCount(string $recipientType, int $recipientId): int
    {
        return $this->model
            ->where('recipient_type', $recipientType)
            ->where('recipient_id', $recipientId)
            ->where('delivery_status', '!=', 'read')
            ->whereNull('read_at')
            ->count();
    }
}
